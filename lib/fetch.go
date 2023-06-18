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
	fmt.Println("Current working directory:", cwd)

	dirname := "content/posts"
	postFiles, err := os.ReadDir(fmt.Sprintf("%s/%s", cwd, dirname))
	if err != nil {
		log.Fatal(err)
	}

	// Read all MDX files from content/posts
	var postRawContents []string
	for _, postFile := range postFiles {
		if postFile.IsDir() || !strings.HasSuffix(postFile.Name(), ".mdx") {
			continue
		}

		// Store the raw content
		postContent, err := os.ReadFile(fmt.Sprintf("%s/%s", dirname, postFile.Name()))
		if err != nil {
			log.Fatal(err)
		}
		postRawContents = append(postRawContents, string(postContent))
	}

	var postContents []types.Post

	// Parse the raw content
	for _, postContent := range postRawContents {
		var postMatter types.Frontmatter

		// Parse the frontmatter
		// e.g. --- title: "Hello, World!" description: "This is a test post" ---
		rest, err := frontmatter.Parse(strings.NewReader(postContent), &postMatter)
		if err != nil {
			log.Fatal(err)
		}

		// Store the parsed frontmatter along with the rest of the content
		postContents = append(postContents, types.Post{
			Content:     string(rest),
			Frontmatter: postMatter,
		})
	}

	return postContents
}
