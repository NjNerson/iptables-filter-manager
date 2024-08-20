from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import subprocess

app = Flask(__name__)
CORS(app)

def create_rule(data):
    data = request.json
    chain = data.get('chain')
    target = data.get('target')
    protocol = data.get('protocol')
    source_ip = data.get('sip')
    source_port = data.get('sport')
    destination_ip = data.get('dip')
    destination_port = data.get('dport')
    rsource_ip = data.get('rsip')
    rsource_ip2 = data.get('rsip2')   
    rsource_port = data.get('rsport')
    rsource_port2 = data.get('rsport2')
    rdestination_ip = data.get('rdip')
    rdestination_ip2 = data.get('rdip2')   
    rdestination_port = data.get('rdport')
    rdestination_port2 = data.get('rdport2')

    # Build the iptables command
    command = f"iptables"
    if chain  is not None and chain != "":
        command += f" -A {chain}"
    if source_ip  is not None and source_ip != "":
        command += f" -s {source_ip}"
    if source_port is not None and  source_port!= "" :
        command += f" --sport {source_port}"
    if destination_ip is not None and  destination_ip!= "" :
        command += f" -d {destination_ip}"
    if destination_port is not None and  destination_port!= "" :
        command += f" --dport {destination_port}"
    if protocol  is not None and protocol != "" :
        command+= f" -p {protocol}"
    if rsource_ip is not None and  rsource_ip!= "" :
        command+= f" -m iprange --src-range{rsource_ip}-{rsource_ip2}"
    if rsource_port is not None and  rsource_port!= "" :
        command += f" --sport {rsource_port}:{rsource_port2}"
    if rdestination_ip is not None and  rdestination_ip!= "" :
        command+= f" -m iprange --dst-range{rdestination_ip}-{rdestination_ip2}"
    if rdestination_port is not None and  rdestination_port!= "" :
        command += f" --dport {rdestination_port}:{rdestination_port2}"
    if target  is not None and target != "":
        command += f" -j {target}"

    if data["policy"] is not None :
        command = f"iptables -P {chain} {target}"
    

    return command
    
def get_all_users():
    users = []
    try:
        with open('/etc/passwd', 'r') as passwd_file:
            for line in passwd_file:
                parts = line.split(':')
                username = parts[0]
                uid = int(parts[2])
                users.append({"username": username, "uid": uid})
        return users
    except Exception as e:
        return str(e)

@app.route('/api/all_users', methods=['GET'])
def all_users():
    users = get_all_users()
    return jsonify(users), 200
 


def execute_iptables_command(command):
    """Execute an iptables command and return the output."""
    try:
        result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.stdout.decode('utf-8'), None
    except subprocess.CalledProcessError as e:
        return None, e.stderr.decode('utf-8')

@app.route('/api/rules', methods=['GET'])
def get_rules():
    """Retrieve rules from specific chains (INPUT, OUTPUT, FORWARD)."""
    chains = ['INPUT', 'OUTPUT', 'FORWARD']
    all_rules = {}
    
    for chain in chains:
        command = f"iptables -L {chain} --line-numbers -n -v"
        output, error = execute_iptables_command(command)
        if error:
            return jsonify({"error": error}), 400
        all_rules[chain] = output.splitlines()

    return jsonify(all_rules)

@app.route('/api/rule/add', methods=['POST'])
def add_rule():
    """Add a new iptables rule."""
    data = request.json
    command = create_rule(data)
    print(command)
    output, error = execute_iptables_command(command)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Rule added successfully"}), 201


@app.route('/api/rule/delete/<chain>/<int:line_number>', methods=['DELETE'])
def delete_rule(chain, line_number):
    """Delete an iptables rule from a specific chain by line number."""
    command = f"iptables -D {chain} {line_number}"
    output, error = execute_iptables_command(command)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Rule deleted successfully"}), 200


@app.route('/api/rule/update', methods=['PUT'])
def update_rule():
    """Update an iptables rule (by deleting the old rule and adding a new one)."""
    data = request.json
    delete_command = f"iptables -D {data['chain']} {data['rule_num']}"
    output, error = execute_iptables_command(delete_command)
    if error:
        return jsonify({"error": error}), 400

    add_command = f"iptables -A {data['chain']} -s {data['sip']} -d {data['dip']} -p {data['protocol']} --sport {data['sport']} --dport {data['dport']} -j {data['action']}"
    output, error = execute_iptables_command(add_command)
    if error:
        return jsonify({"error": error}), 400

    return jsonify({"message": "Rule updated successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)

