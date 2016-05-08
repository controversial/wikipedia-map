import json
import os
import tempfile


def store(data, directory="/var/www/luke/wikipedia/graphs/"):
    try:
        json.loads(data)
    except ValueError:
        return "not-json"

    tf = tempfile.mkstemp(prefix="", dir=directory)[1]

    with open(tf, "w") as f:
        f.write(data)
    return tf

if __name__ == "__main__":
    print(store('{}'))
