##
from flask import Flask, request, jsonify
from flask_cors import CORS
import networkx as nx
import numpy as np

app = Flask(__name__)
cors = CORS(app)


def create_network(data, nodesDict):
    G = nx.Graph()
    nodes_to_remove = []

    # Add nodes and links to the graph
    for k in nodesDict:
        G.add_node(nodesDict.get(k)['id'], name=k)
    for row in data:
        G.add_edge(nodesDict[row.get('CouISO')]['id'],
                   nodesDict[row.get('ParISO')]['id'], strength=row.get('Value'))
    for node in G.nodes():
        if len(list(G.neighbors(node))) == 0:
            nodes_to_remove.append(node)
    for node in nodes_to_remove:
        G.remove_node(node)
    return G


def get_communities_newman_data(data, nodesDict):
    # Create an empty graph
    G = create_network(data, nodesDict)

    communities = nx.algorithms.community.greedy_modularity_communities(G)
    modularityNum = nx.algorithms.community.modularity(G, communities)

    nodes = []
    edges = []
    communityNodes = []
    communitiesData = []

    response = {"data": {"nodes": [], "edges": []},
                "modularity": modularityNum, "communitiesInfo": []}
    for i in range(len(communities)):

        total = 0
        continentsData = {'Europe': 0,
                          'Americas': 0, 'Asia': 0, 'Africa': 0, 'Oceania': 0, 'Total': 0}

        # Calculate the degree centrality for each node in the community
        centrality = nx.degree_centrality(G.subgraph(communities[i]))

        for cou in communities[i]:
            node = {"id": cou, "name": nodesDict[G.nodes[cou]['name']]['name'],
                    "continent": nodesDict[G.nodes[cou]['name']]['continent'], "group": i + 1,
                    "code": nodesDict[G.nodes[cou]['name']]['code'], "degree": centrality[cou]}
            nodesDict[G.nodes[cou]['name']]['group'] = i + 1
            nodes.append(node)
            communityNodes.append(node)
            continentsData[nodesDict[G.nodes[cou]['name']]['continent']] += 1
            total += 1

        for k in continentsData:
            continentsData[k] = round((continentsData[k] / total) * 100, 2)
        continentsData['Total'] = total

        communitiesData.append(
            {'group': i + 1, 'data': continentsData.copy(), 'nodes': communityNodes})
        communityNodes = []

    idEdge = 300
    edgesCommunity = [[], [], [], [], [], [], [], []]
    for s, t, v in G.edges(data='strength'):
        edgeToAdd = {"source": s, "target": t,
                     "color": "#e0e0e0", 'value': v}

        edges.append(edgeToAdd)
        idEdge += 1
        groupKey = nodesDict[G.nodes[s]['name']]['group']

        if groupKey == nodesDict[G.nodes[t]['name']]['group']:
            edgesCommunity[groupKey].append(edgeToAdd)

    for i in range(1, len(edgesCommunity)):
        for communityVar in communitiesData:
            if communityVar['group'] == i:
                communityVar['edges'] = edgesCommunity[i]
                communityVar['networkType'] = determine_network_type(
                    communityVar['nodes'], edgesCommunity[i])

    response.get('data')['nodes'] = nodes
    response.get('data')['edges'] = edges
    response.get('data')['networkType'] = determine_network_type(nodes, edges)
    response['communitiesInfo'] = communitiesData
    return response


def determine_network_type(nodes, links):
    # Create graph
    G = nx.Graph()
    for n in nodes:
        try:
            G.add_node(n['id'], name=n['name'])
        except:
            print("Failed in nodes")
    for l in links:
        try:
            G.add_edge(l['source'], l['target'], strength=l['value'])
        except:
            print("Failed in links")
    # Get largest connected component
    largest_cc = max(nx.connected_components(G), key=len)
    # Create a subgraph containing only the largest connected component
    G = G.subgraph(largest_cc)
    # Calculate clustering coefficient
    clustering = nx.average_clustering(G)
    # We need to fix the average degree parameter, which is the second one that the watts_strogatz_graph receives.
    watts_strogatz_graph_clustering = nx.average_clustering(
        nx.watts_strogatz_graph(len(G), 2, 0.1))
    # Calculate degree assortativity coefficient
    degree_assortativity = nx.degree_assortativity_coefficient(G)
    # Determine network type
    if clustering > watts_strogatz_graph_clustering:
        return "The network is small-world"
    elif degree_assortativity < -0.1:
        return "The network is scale-free"
    else:
        return "The network is neither small-world nor scale-free"


@app.route('/newman', methods=['POST'])
def get_newman_communities():
    data = request.get_json()
    if data == {} or data.get('countries') is None or data.get('trades') is None:
        return

    nodesDict = {}
    for country in data.get('countries'):
        nodesDict[country.get('Code')] = {'id': country.get('Id'),
                                          'name': country.get('Name'), 'continent': country.get('Continent'),
                                          'group': 0, "code": country.get('Code')}

    newmanData = get_communities_newman_data(data.get('trades'), nodesDict)
    response = jsonify(newmanData)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run()
