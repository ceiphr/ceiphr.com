package types

type Frontmatter struct {
	Title       string   `yaml:"title"`
	Description string   `yaml:"description"`
	Topics      []string `yaml:"topics"`
}

type Post struct {
	Content     string
	Frontmatter Frontmatter
}
