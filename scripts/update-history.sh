#!/usr/bin/env bash

# Update the generated history files in the .generated directory
# with the latest git history for the project and each post.

# For echo -e color support.
TXT_DEFAULT='\033[0m'
TXT_GREEN='\033[0;32m'
TXT_BOLD='\033[1m'

# https://no-color.org/
if [[ -n "${NO_COLOR}" ]]; then
    TXT_DEFAULT='\033[0m'
    TXT_GREEN='\033[0m'
fi

# If we're running in Vercel, we need to install jq.
if [[ -n "${VERCEL}" ]]; then
    mkdir -p .bin
    curl -L https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -o /vercel/path0/.bin/jq 2>/dev/null
    export PATH=$PATH:/vercel/path0/.bin
fi

# History for project

# Get the git commit history related to the project.
project_history=("$(
    git log --pretty=format:'{%n  "commit": "%h",%n  "author": "%an",%n  "date": "%ad",%n  "message": "%B"%n},' --date=iso8601-strict |
        tr '\n' ' ' |
        perl -pe 'BEGIN{print "["}; END{print "]\n"}' |
        perl -pe 's/},]/}]/'
)")

# Write the git history of the project to a JSON file.
trimmed_json=$(echo "${project_history[@]}" | jq 'walk(if type == "string" then sub("^ +"; "") | sub(" +$"; "") else . end)')
echo "$trimmed_json" >.generated/history.json

# Format the JSON.
npx prettier --write .generated/history.json

echo -e "${TXT_GREEN}>${TXT_DEFAULT} Updated ${TXT_BOLD}.generated/history.json${TXT_DEFAULT} with the latest git history."

# History for all posts

# Get all posts
posts=$(git ls-files content/posts/ | grep "content/posts/.*\.mdx")

# If there are no posts, exit.
if [[ -z "${posts}" ]]; then
    echo -e "${TXT_GREEN}>${TXT_DEFAULT} No need to update the git history, no posts exist."
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
echo "$trimmed_json" >.generated/posts-history.json

# Format the JSON.
npx prettier --write .generated/posts-history.json

echo -e "${TXT_GREEN}>${TXT_DEFAULT} Updated ${TXT_BOLD}.generated/posts-history.json${TXT_DEFAULT} with the latest git history of each post."
