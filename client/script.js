const button = document.getElementById('getButton');

const ws = new WebSocket('ws://localhost:5050');

button.addEventListener('click', () => {
    const date = document.getElementById('datetime');
    const newDate = new Date(date.value);
    if (newDate.toDateString() === 'Invalid Date') {
        alert('Please select the proper date and time');
    } else {
        ws.send(newDate);
    }
})
const tbody = document.getElementById('randomData');

ws.onmessage = async function (message) {
    const msg = await message;
    if (msg.data === 'No data') {
        alert('Sorry, no Data present in the selected Date range');
    } else {
        const table = document.querySelector('.styled-table');
        const msgObj = JSON.parse(msg.data);
        const node = document.createElement("TR");
        for (const [key, value] of Object.entries(msgObj)) {
            if (key != '_id') {
                const tdEle = document.createElement('TD');
                const textnode = document.createTextNode(value);
                tdEle.appendChild(textnode);
                node.appendChild(tdEle);
            }
        }
        tbody.appendChild(node);
        table.hidden = false;
    }
}