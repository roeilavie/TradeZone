##
import pymssql as pymssql
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import networkx as nx

app = Flask(__name__)
cors = CORS(app)


def getCommunitiesNewmanData(data, nodesDict):
    colors = ['gray', "yellow", 'red', 'green',
              'blue', 'pink', 'orange', 'brown']

    # Create an empty graph
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
    communities = nx.algorithms.community.greedy_modularity_communities(G)
    modularityNum = nx.algorithms.community.modularity(G, communities)

    # Print the communities
    G.nodes()
    nodes = []
    edges = []

    sumNodesCommunity = 0
    communitiesData = []

    response = {"data": {"nodes": [], "edges": []},
                "modularity": modularityNum, "communitiesInfo": []}
    for i in range(len(communities)):

        total = 0
        continentsData = {'Europe': 0,
                          'Americas': 0, 'Asia': 0, 'Africa': 0, 'Oceania': 0, 'Total': 0}

        if len(communities[i]) == 1:
            for cou in communities[i]:
                node = {
                    "id": cou, "name": nodesDict[G.nodes[cou]['name']]['name'],
                    "continent": nodesDict[G.nodes[cou]['name']]['continent'], "group": 0}
                nodes.append(node)
            continue

        for cou in communities[i]:
            node = {"id": cou, "name": nodesDict[G.nodes[cou]['name']]['name'],
                    "continent": nodesDict[G.nodes[cou]['name']]['continent'], "group": i + 1}
            nodes.append(node)

            continentsData[nodesDict[G.nodes[cou]['name']]['continent']] += 1
            total += 1

        for k in continentsData:
            continentsData[k] = round((continentsData[k] / total) * 100, 2)
        continentsData['Total'] = total

        communitiesData.append({'group': i + 1, 'data': continentsData.copy()})

    idEdge = 300
    for s, t, v in G.edges(data='strength'):
        edges.append({"source": s, "target": t,
                     "color": "#e0e0e0", 'value': v})
        idEdge += 1
    response.get('data')['nodes'] = nodes
    response.get('data')['edges'] = edges
    response['communitiesInfo'] = communitiesData
    return response


@app.route('/newman', methods=['POST'])
def getNewmanCommunities():
    #url = 'https://proj.ruppin.ac.il/cgroup1/test2/tar2/api/countries'
    #response = requests.get(url)
    #rows = response.json()
    #nodesDict = {}
    #for country in rows:
    #    nodesDict[country.get('Code')] = {'id': country.get('Id'),
     #                                     'name': country.get('Name'), 'continent': country.get('Continent')}

    #ind = request.json.get('ind')
    #year = request.json.get('year')
    #url = 'https://proj.ruppin.ac.il/cgroup1/test2/tar2/api/trades?ind=' + str(ind) + '&year=' + str(year)
    #response = requests.get(url)
    #data = response.json()

    # newmanData = getCommunitiesNewmanData(data, nodesDict)
    # response = jsonify(newmanData)
    # response.headers.add('Access-Control-Allow-Origin', '*')
    # return response

    data = request.get_json()
    if data == {} or data.get('countries') is None or data.get('trades') is None:
        return

    nodesDict = {}
    for country in data.get('countries'):
        nodesDict[country.get('Code')] = {'id': country.get('Id'),
                                          'name': country.get('Name'), 'continent': country.get('Continent')}


    newmanData = getCommunitiesNewmanData(data.get('trades'), nodesDict)
    print(newmanData)
    response = jsonify(newmanData)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run(port=5001)
