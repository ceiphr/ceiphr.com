package types

type Frontmatter struct {
	Title       string   `yaml:"title" json:"title"`
	Description string   `yaml:"description" json:"description"`
	Topics      []string `yaml:"topics" json:"topics"`
}

type Post struct {
	URL         string      `json:"url"`
	Frontmatter Frontmatter `json:"frontmatter"`
	Content     string      `json:"content"`
}
