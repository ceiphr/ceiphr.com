#!/usr/bin/env bash

# Update the "Last updated" and "THANKS" sections of the humans.txt file.

# List of contributors to ignore for the "THANKS" section.
IGNORED_CONTRIBUTORS=(
    "Ari Birnbaum"
)

# For echo -e color support.
TXT_DEFAULT='\033[0m'
TXT_GREEN='\033[0;32m'
TXT_BOLD='\033[1m'

# https://no-color.org/
if [[ -n "${NO_COLOR}" ]]; then
    TXT_DEFAULT='\033[0m'
    TXT_GREEN='\033[0m'
fi

# Get the current date.
current_date=$(date --iso-8601=seconds)

# Update the "Last Updated" section of the humans.txt file.
sed -i "s/Last updated: .*/Last updated: ${current_date}/" "public/humans.txt"

echo -e "${TXT_GREEN}>${TXT_DEFAULT} Updated the ${TXT_BOLD}Last updated${TXT_DEFAULT} section of the ${TXT_BOLD}humans.txt${TXT_DEFAULT} file."

# Get the list of contributors.
contributors=$(git log --format='%aN <%aE>' | sort -fu)

# Rewrite the email addresses to be of the form name [at] example.com.
contributors=$(echo "${contributors}" | sed -r 's/@/ [at] /g')

# Reverse alphabetize the list of contributors.
# When we write the list to the humans.txt file, it will be in alphabetical order.
sorted_contributors=$(echo "${contributors}" | sort -r)

# Convert contributors string to an array
readarray -t contributor_array <<<"${sorted_contributors}"

# Clean the current /* THANKS */ section
sed -ri '/^.* <.* \[at\] [a-zA-Z0-9]+\.[a-zA-Z]+>$/d' "public/humans.txt"
sed -ri '/^Contribute here: https:\/\/github.com\/ceiphr\/ceiphr.com$/d' "public/humans.txt"

# Remove the trailing newline after the /* THANKS */ section header.
sed -i '/\/\* THANKS \*\//{N;s/\n//;}' "public/humans.txt"

filtered_contributors=()
for contributor in "${contributor_array[@]}"; do
    # Skip if contributor string contains the name of a contributor to ignore.
    for ignored_contributor in "${IGNORED_CONTRIBUTORS[@]}"; do
        if [[ "${contributor}" == *"${ignored_contributor}"* ]]; then
            continue 2
        fi
    done

    filtered_contributors+=("${contributor}")
done

if [[ "${#filtered_contributors[@]}" -eq 0 ]]; then
    sed -i "/\/\* THANKS \*\//a Contribute here: https://github.com/ceiphr/ceiphr.com" "public/humans.txt"
else
    # Update the /* THANKS */ section of the humans.txt file.
    for contributor in "${filtered_contributors[@]}"; do
        sed -i "/\/\* THANKS \*\//a ${contributor}" "public/humans.txt"
    done
fi

# Add a newline after the /* THANKS */ section header.
sed -i 's/\/\* THANKS \*\//&\
/' "public/humans.txt"

echo -e "${TXT_GREEN}>${TXT_DEFAULT} Updated the ${TXT_BOLD}THANKS${TXT_DEFAULT} section of the ${TXT_BOLD}humans.txt${TXT_DEFAULT} file."
