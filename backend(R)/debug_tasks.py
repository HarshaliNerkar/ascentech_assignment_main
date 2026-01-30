import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(url, method='GET', data=None, headers=None):
    if headers is None:
        headers = {}
    
    if data is not None:
        data_bytes = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    else:
        data_bytes = None
        
    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            body = resp.read().decode('utf-8')
            try:
                json_body = json.loads(body)
            except:
                json_body = body
            return status, json_body
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        # Always truncate
        short_body = (body[:200] + '...') if len(body) > 200 else body
        
        # Try to find title if HTML
        import re
        title = re.search(r'<title>(.*?)</title>', body, re.IGNORECASE)
        page_title = title.group(1) if title else "No Title"
        
        print(f"HTTPError: {e.code} - Title: {page_title}")
        print(f"Body Preview: {short_body}")
        
        try:
            return e.code, json.loads(body)
        except:
            return e.code, body
    except Exception as e:
        print(f"Error: {e}")
        return 0, str(e)

def run_test():
    print(f"Testing against {BASE_URL}...")
    
    # 1. Register/Login
    username = "debug_user_02"  # New user to avoid conflict
    password = "debug_password_123"
    email = "debug2@example.com"
    
    print("1. Registering...")
    status, body = make_request(f"{BASE_URL}/users/register/", 'POST', 
                                {"username": username, "password": password, "email": email})
    
    if status == 201:
        print("   Registered.")
    elif status == 400 and "username" in str(body):
         print("   User already exists (proceeding to login).")
    else:
        print(f"   Registration Failed: {status} {body}")

    print("2. Logging in...")
    status, body = make_request(f"{BASE_URL}/users/login/", 'POST', 
                                {"username": username, "password": password})
    if status != 200:
        print(f"   Login Failed: {status} {body}")
        return
        
    access_token = body['access']
    print("   Login Successful.")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # 2. Create Project
    print("3. Creating Project...")
    project_payload = {"name": "Debug Project", "description": "For debugging tasks"}
    status, body = make_request(f"{BASE_URL}/projects/", 'POST', project_payload, headers)
    
    if status != 201:
        print(f"   Create Project Failed: {status} {body}")
        return
        
    project_id = body['id']
    print(f"   Project Created: ID {project_id}")
    
    # 3. Create Task
    print("4. Creating Task...")
    task_payload = {
        "title": "Debug Task",
        "description": "This is a task",
        "status": "TODO",
        "project": project_id
    }
    
    status, body = make_request(f"{BASE_URL}/tasks/", 'POST', task_payload, headers)
    if status != 201:
        print(f"   Create Task Failed: {status} {body}")
    else:
        print(f"   Task Created Successfully: {body}")

if __name__ == "__main__":
    run_test()
