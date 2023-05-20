#!/usr/bin/env bash

# Update the date of each modified post.

# Get all posts that have been modified.
modified_posts=$(git diff --name-only HEAD | grep "content/posts/.*\.mdx")

# If there are no modified posts, exit.
if [[ -z "${modified_posts}" ]]; then
    exit 0
fi

# Update the date of each modified post.
for post in ${modified_posts}; do
    # Get the date of the last commit.
    date=$(git log -1 --format="%aI" "${post}")

    # Update the date in the post.
    sed -i "s/date: .*/date: '${date}'/" "${post}"
done
