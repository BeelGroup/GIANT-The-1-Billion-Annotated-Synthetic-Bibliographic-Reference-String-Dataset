import pandas as pd
import sys

inputFile = sys.argv[1]

# sum articleTypes from input file and write to output.csv
data = pd.read_csv(inputFile, index_col=None)
file = open('output.csv', "a")

for articleType, total in dict(data['articleType'].value_counts()).items():
    file.write(str(articleType) + "," + str(total) + "\n")

file.close()


# sum all the same articleTypes in output.csv and write to csv
df = pd.read_csv('output.csv', index_col=None)

df['total'] = df.groupby(['articleType'])['total'].transform('sum')
df = df.drop_duplicates(subset=['articleType'])

df.to_csv('outputSummary.csv', index=False)
