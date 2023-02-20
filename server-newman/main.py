##
import json
import pymssql as pymssql
from flask import Flask, request
from flask_cors import CORS
import networkx as nx

app = Flask(__name__)
cors = CORS(app)


def getCommunitiesNewmanData(data, nodesDict):
    colors = ['gray', "yellow", 'red', 'green',
              'blue', 'pink', 'orange', 'brown']

    # Create an empty graph
    G = nx.Graph()

    # Add nodes and links to the graph
    for k in nodesDict:
        G.add_node(nodesDict.get(k)['id'], name=k)
    for row in data:
        G.add_edge(nodesDict[row[0]]['id'], nodesDict[row[1]]['id'], strength=row[4])
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
    print(communities)
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
        edges.append({"source": s, "target": t, "color": "#e0e0e0", 'value': v})
        idEdge += 1
    response.get('data')['nodes'] = nodes
    response.get('data')['edges'] = edges
    response['communitiesInfo'] = communitiesData
    return response


@app.route('/newman', methods=['POST'])
def getNewmanCommunities():
    conn = pymssql.connect(server='Media.ruppin.ac.il', user='igroup101', password='igroup101_69556',
                           database='igroup101_prod')
    cursor = conn.cursor()
    # Call the stored procedure
    stored_proc_name = 'spGetAllCountries'
    cursor.callproc(stored_proc_name)
    rows = cursor.fetchall()
    nodesDict = {}
    # Loop through the tuples in the array
    for country in rows:
        # Add the key-value pair to the dictionary
        nodesDict[country[2]] = {'id': country[0], 'name': country[1], 'continent': country[3]}

    stored_proc_name = 'spReadTradesByInd&Year'
    ind = request.json.get('ind')
    year = request.json.get('year')
    cursor.callproc(stored_proc_name, (ind, year))
    data = cursor.fetchall()
    cursor.close()
    conn.close()

    newmanData = getCommunitiesNewmanData(data, nodesDict)
    # Process the resultset or return a message
    return json.dumps(newmanData)


# Close the connection and cursor

if __name__ == '__main__':
    app.run()
