#!/usr/bin/env bash

# Update the git history of each post.

# Get all posts
posts=$(git ls-files content/posts/ | grep "content/posts/.*\.mdx")

# If there are no posts, exit.
if [[ -z "${posts}" ]]; then
    exit 0
fi

posts_history=()

# Get the git commit history related to each post in JSON format.
for post in ${posts}; do
    # Get the git commit history related to the post.
    post_history=("$(
        git log --pretty=format:'{%n  "commit": "%h",%n  "author": "%an",%n  "date": "%ad",%n  "message": "%B"%n},' --date=iso8601-strict -- "${post}" |
            tr '\n' ' ' |
            perl -pe 'BEGIN{print "["}; END{print "]\n"}' |
            perl -pe 's/},]/}]/'
    )")

    # If the post has no git history, skip it.
    if [[ "${#post_history[@]}" == 0 ]]; then
        continue
    fi

    # Get the post slug.
    post_slug=$(echo "${post}" | sed -e 's/content\/posts\///' -e 's/\.mdx//')

    # Add the post history to the array.
    posts_history+=("{\"slug\": \"${post_slug}\", \"history\": ${post_history[@]}},")
done

# Write the git history of each post to a JSON file.
json=$(echo "${posts_history[@]}" |
    sed '$ s/.$//' |
    awk 'BEGIN{print "["} {print} END{print "]"}')
trimmed_json=$(echo "$json" | jq 'walk(if type == "string" then sub("^ +"; "") | sub(" +$"; "") else . end)')
echo "$trimmed_json" >content/posts/history.json

# Format the JSON.
npx prettier --write content/posts/history.json
