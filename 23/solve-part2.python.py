import networkx as nx

lines = [s.strip().split('-') for s in open('real.txt', 'r').readlines()]
G = nx.Graph(lines)

s = max(nx.find_cliques(G), key=len)
s.sort()

print(','.join(s))
