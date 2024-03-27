AWS.config.region = 'YOUR_AWS_REGION'; // e.g., 'us-east-1'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'YOUR_IDENTITY_POOL_ID',
});

const docClient = new AWS.DynamoDB.DocumentClient();

function addItem(itemName) {
  const params = {
    TableName: 'YOUR_DYNAMODB_TABLE_NAME',
    Item: {
      id: AWS.util.uuid.v4(),
      name: itemName,
    },
  };
  docClient.put(params, function (err, data) {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
      fetchItems();
    }
  });
}

function fetchItems() {
  const params = {
    TableName: 'YOUR_DYNAMODB_TABLE_NAME',
  };
  docClient.scan(params, function (err, data) {
    if (err) {
      console.error('Unable to fetch items. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Fetched items:', JSON.stringify(data, null, 2));
      displayItems(data.Items);
    }
  });
}

function displayItems(items) {
  const itemList = document.getElementById('itemList');
  itemList.innerHTML = '';
  items.forEach(function (item) {
    const li = document.createElement('li');
    li.textContent = item.name;
    itemList.appendChild(li);
  });
}

document.getElementById('itemForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const itemName = document.getElementById('itemName').value.trim();
  if (itemName) {
    addItem(itemName);
    document.getElementById('itemName').value = '';
  }
});

fetchItems();
