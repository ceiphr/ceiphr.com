#!/usr/bin/env bash

# Create a new post.

# For echo -e color support.
TXT_DEFAULT='\033[0m'
TXT_GREY='\033[2m'
TXT_GREEN='\033[0;32m'
TXT_RED='\033[0;31m'
TXT_BOLD='\033[1m'

# https://no-color.org/
if [[ -n "${NO_COLOR}" ]]; then
    TXT_DEFAULT='\033[0m'
    TXT_GREY='\033[0m'
    TXT_GREEN='\033[0m'
    TXT_RED='\033[0m'
fi

# Get the title of the post.
echo -e "${TXT_GREEN}>${TXT_DEFAULT} What is the title of the post?"
read -r title

if [[ -z "${title}" ]]; then
    echo -e "${TXT_RED}!${TXT_DEFAULT} The title cannot be empty."
    exit 1
fi

# Get the description of the post.
echo -e "${TXT_GREEN}>${TXT_DEFAULT} What is the description of the post?"
read -r description

if [[ -z "${description}" ]]; then
    echo -e "${TXT_RED}!${TXT_DEFAULT} The description cannot be empty."
    exit 1
fi

# Slugify the title.
slug=$(echo "${title}" | sed -e 's/[^[:alnum:]]/-/g' | tr -s '-' | tr "[:upper:]" "[:lower:]")

# Check if a post with the same slug already exists.
if [[ -f "content/posts/${slug}.mdx" ]]; then
    echo -e "${TXT_RED}!${TXT_DEFAULT} A post with the slug ${TXT_BOLD}${slug}${TXT_DEFAULT} already exists."

    # Ask if the user wants to modify the slug.
    echo -e "${TXT_GREEN}>${TXT_DEFAULT} Do you want to modify the slug? [y/N]"
    read -r modify_slug

    if [[ "${modify_slug}" == "y" ]]; then
        echo -e "${TXT_GREEN}>${TXT_DEFAULT} Enter the new slug:"
        read -r slug
    else
        echo -e "${TXT_GREY}-${TXT_DEFAULT} Exiting..."
        exit 1
    fi

    # Check if the provided slug is valid.
    if [[ -z "${slug}" ]]; then
        echo -e "${TXT_RED}!${TXT_DEFAULT} The slug cannot be empty."
        exit 1
    fi

    # Check if a post with the same slug already exists.
    if [[ -f "content/posts/${slug}.mdx" ]]; then
        echo -e "${TXT_RED}!${TXT_DEFAULT} A post with the slug ${TXT_BOLD}${slug}${TXT_DEFAULT} already exists."
        exit 1
    fi
fi

# Ask what template to use.
echo -e "${TXT_GREEN}>${TXT_DEFAULT} What template do you want to use? [default]"

# Get the list of templates.
templates=$(find "content/templates" -type f -name "*.mdx" -printf "%f\n" | sed -e 's/\.mdx$//g')

# Print the list of templates.
for template in ${templates}; do
    echo -e "${TXT_GREY}- ${template}${TXT_DEFAULT}"
done

# Read the template.
read -r template

# Use the default template if the user didn't provide one.
if [[ -z "${template}" ]]; then
    template="default"
fi

# Check if the provided template is valid.
if [[ ! -f "content/templates/${template}.mdx" ]]; then
    echo -e "${TXT_RED}!${TXT_DEFAULT} The template ${TXT_BOLD}${template}${TXT_DEFAULT} does not exist."
    exit 1
fi

# Create the post.
echo -e "${TXT_GREEN}>${TXT_DEFAULT} Creating the post ${TXT_BOLD}${slug}.mdx${TXT_DEFAULT} from the template ${TXT_BOLD}${template}.mdx${TXT_DEFAULT}..."
cp "content/templates/${template}.mdx" "content/posts/${slug}.mdx"

# Replace frontmatter.
sed -i "s/title:/title: ${title}/g" "content/posts/${slug}.mdx"
sed -i "s/description:/description: ${description}/g" "content/posts/${slug}.mdx"
sed -i "s/date:/date: '$(date --iso-8601=seconds)'/g" "content/posts/${slug}.mdx"

# Open the post in the editor.
code "content/posts/${slug}.mdx"
