package api

import (
	"net/http"

	"github.com/ceiphr/ceiphr.com/lib"
	"github.com/ceiphr/ceiphr.com/types"
	"github.com/gin-gonic/gin"
	"github.com/lithammer/fuzzysearch/fuzzy"
)

var (
	app      *gin.Engine
	allPosts []types.Post
)

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

	var rawResults []types.Post
	for _, post := range allPosts {
		var rank int

		// Search the title
		curRank := fuzzy.RankMatch(body.Query, post.Frontmatter.Title)
		if curRank > rank {
			rank = curRank
		}

		// Search the description
		curRank = fuzzy.RankMatch(body.Query, post.Frontmatter.Description)
		if curRank > rank {
			rank = curRank
		}

		// Search the topics
		for _, topic := range post.Frontmatter.Topics {
			curRank = fuzzy.RankMatch(body.Query, topic)
			if curRank > rank {
				rank = curRank
			}
		}

		// Search the content
		curRank = fuzzy.RankMatch(body.Query, post.Content)
		if curRank > rank {
			rank = curRank
		}

		// If the rank is greater than 0, then the query matched
		if rank > 0 {
			rawResults = append(rawResults, post)
		}
	}

	var results []types.Frontmatter
	for _, rawResult := range rawResults {
		results = append(results, rawResult.Frontmatter)
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

	app.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": "this page could not be found",
		})
	})
	app.POST("/", HandlePost)
}
