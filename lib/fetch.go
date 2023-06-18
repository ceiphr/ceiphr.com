package lib

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/adrg/frontmatter"
	"github.com/ceiphr/ceiphr.com/types"
)

func FetchPosts() []types.Post {
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	dirname := "content/posts"
	if os.Getenv("GO_ENV") == "development" {
		// If we're in development, then we need to go up a few directories
		// to get to the content directory
		dirname = "../../../../content/posts"
	}

	postFiles, err := os.ReadDir(fmt.Sprintf("%s/%s", cwd, dirname))
	if err != nil {
		log.Fatal(err)
	}

	type postRawContent struct {
		Slug    string
		Content string
	}

	// Read all MDX files from content/posts
	var rawPosts []postRawContent
	for _, postFile := range postFiles {
		if postFile.IsDir() || !strings.HasSuffix(postFile.Name(), ".mdx") {
			continue
		}

		// Store the raw content
		postContent, err := os.ReadFile(fmt.Sprintf("%s/%s", dirname, postFile.Name()))
		if err != nil {
			log.Fatal(err)
		}

		rawPosts = append(rawPosts, postRawContent{
			Slug:    strings.TrimSuffix(postFile.Name(), ".mdx"),
			Content: string(postContent),
		})
	}

	var posts []types.Post

	// Parse the raw content
	for _, rawPost := range rawPosts {
		var postMatter types.Frontmatter

		// Parse the frontmatter
		// e.g. --- title: "Hello, World!" description: "This is a test post" ---
		rest, err := frontmatter.Parse(strings.NewReader(rawPost.Content), &postMatter)
		if err != nil {
			log.Fatal(err)
		}

		// Store the parsed frontmatter along with the rest of the content
		posts = append(posts, types.Post{
			URL:         fmt.Sprintf("/blog/%s", rawPost.Slug),
			Frontmatter: postMatter,
			Content:     string(rest),
		})
	}

	return posts
}
