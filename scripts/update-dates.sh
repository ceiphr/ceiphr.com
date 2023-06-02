#!/usr/bin/env bash

# Update the date of each modified post.

# TODO Add a way to ignore certain posts (e.g. grandfathered posts). Maybe a .gitignore for posts?

# For echo -e color support.
TXT_DEFAULT='\033[0m'
TXT_GREEN='\033[0;32m'
TXT_BOLD='\033[1m'

# https://no-color.org/
if [[ -n "${NO_COLOR}" ]]; then
    TXT_DEFAULT='\033[0m'
    TXT_GREEN='\033[0m'
fi

# Get all posts that have been modified.
modified_posts=$(git diff --name-only HEAD | grep "content/posts/.*\.mdx")

# If there are no modified posts, exit.
if [[ -z "${modified_posts}" ]]; then
    echo -e "${TXT_GREEN}>${TXT_DEFAULT} No need to update the dates, no posts have been modified."
    exit 0
fi

# Update the date of each modified post.
for post in ${modified_posts}; do
    # Update the date in the post to the current date.
    sed -i "s/date: .*/date: '$(date --iso-8601=seconds)'/" "${post}"

    # Log the updated post.
    echo -e "${TXT_GREEN}>${TXT_DEFAULT} Updated the date of ${TXT_BOLD}${post}${TXT_DEFAULT}."
done

# Update the "Last Updated" section of the humans.txt file.
sed -i "s/Last updated: .*/Last updated: $(date +"%B %d, %Y")/" "public/humans.txt"

echo -e "${TXT_GREEN}>${TXT_DEFAULT} Updated the ${TXT_BOLD}Last updated${TXT_DEFAULT} section of the ${TXT_BOLD}humans.txt${TXT_DEFAULT} file."
