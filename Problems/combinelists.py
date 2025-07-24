def combine_lists(list1, list2):
    all_elements = list1 + list2
    all_elements.sort(key=lambda x: x["positions"][0])

    combined = []
    i = 0

    while i < len(all_elements):
        current = all_elements[i]
        c_left, c_right = current["positions"]
        c_len = c_right - c_left

        j = i + 1
        while j < len(all_elements):
            next_elem = all_elements[j]
            n_left, n_right = next_elem["positions"]
            n_len = n_right - n_left

            overlap = max(0, min(c_right, n_right) - max(c_left, n_left))

            if overlap > c_len / 2 or overlap > n_len / 2:
                current["values"].extend(next_elem["values"])
                current["positions"][1] = max(c_right, n_right)
                all_elements.pop(j)
                c_right = current["positions"][1]
                c_len = c_right - c_left
            else:
                j += 1

        combined.append(current)
        i += 1

    return combined
list1 = [
    {"positions": [0, 5], "values": [1, 2]},
    {"positions": [10, 15], "values": [3]}
]

list2 = [
    {"positions": [3, 7], "values": [4]},
    {"positions": [12, 18], "values": [5, 6]}
]

result = combine_lists(list1, list2)
print(result)
