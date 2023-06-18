package api

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"sort"
	"time"

	"github.com/ceiphr/ceiphr.com/lib"
	"github.com/ceiphr/ceiphr.com/types"
	"github.com/gin-gonic/gin"
	"github.com/lithammer/fuzzysearch/fuzzy"
	"github.com/redis/go-redis/v9"
)

var (
	app      *gin.Engine
	rdb      *redis.Client
	ctx      = context.Background()
	allPosts []types.Post
)

type fuzzyResult struct {
	URL         string   `json:"url"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Topics      []string `json:"topics"`
}

func fuzzySearch(query string, posts []types.Post) []fuzzyResult {

	type fuzzyRankedResult struct {
		Post types.Post
		Rank int
	}

	var rawResults []fuzzyRankedResult

	for _, post := range allPosts {
		var rank int

		// Search the title
		if curRank := fuzzy.RankMatch(query, post.Frontmatter.Title); curRank > rank {
			rank = curRank
		}

		// Search the description
		if curRank := fuzzy.RankMatch(query, post.Frontmatter.Description); curRank > rank {
			rank = curRank
		}

		// Search the topics
		for _, topic := range post.Frontmatter.Topics {
			if curRank := fuzzy.RankMatch(query, topic); curRank > rank {
				rank = curRank
			}
		}

		// If the rank is greater than 0, then the query matched
		if rank > 0 {
			rawResults = append(rawResults, fuzzyRankedResult{post, rank})
		}
	}

	// Sort the results by rank
	sort.SliceStable(rawResults, func(i, j int) bool {
		return rawResults[i].Rank > rawResults[j].Rank
	})

	var results []fuzzyResult
	for _, rawResult := range rawResults {
		results = append(results, fuzzyResult{
			URL:         rawResult.Post.URL,
			Title:       rawResult.Post.Frontmatter.Title,
			Description: rawResult.Post.Frontmatter.Description,
			Topics:      rawResult.Post.Frontmatter.Topics,
		})
	}

	return results
}

func HandlePost(c *gin.Context) {
	body := struct {
		Query string `json:"query"`
	}{}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": err.Error(),
		})
		return
	}

	if val, err := rdb.Get(ctx, fmt.Sprintf("search:%s", body.Query)).Result(); err == nil {
		c.JSON(http.StatusOK, gin.H{
			"results": val,
		})
		return
	}

	results := fuzzySearch(body.Query, allPosts)

	// Cache the results
	if err := rdb.Set(ctx, fmt.Sprintf("search:%s", body.Query), results, time.Hour).Err(); err != nil {
		// TODO This is returning EOF for some reason
		fmt.Println(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"results": results,
	})
}

func Handler(w http.ResponseWriter, r *http.Request) {
	app.ServeHTTP(w, r)
}

func init() {
	app = gin.New()
	allPosts = lib.FetchPosts()

	if opt, err := redis.ParseURL(os.Getenv("KV_URL")); err != nil {
		panic(err)
	} else {
		rdb = redis.NewClient(opt)
	}

	app.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"errors": "route not found",
		})
	})
	app.POST("/api/search", HandlePost)
}
