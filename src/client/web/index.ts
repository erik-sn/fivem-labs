const RESOURCE_NAME = 'demo';
const ELEVATOR_TYPE = 'elevator';
const ELEVATOR_CONTAINER = '#elevator-container';
const ELEVATOR_CLOSE_BUTTON = '#elevator-close';
const ELEVATOR_BUTTON = '.button__elevator';
const ESCAPE_KEY = 27;

console.log('Index loaded');

function handleElevatorUi(value) {
    console.log(`Handle Elevator UI: ${value}`);
    if (value) {
        $(ELEVATOR_CONTAINER).show();
    } else {
        $(ELEVATOR_CONTAINER).hide();
    }
}

function closeElevatorUi() {
    console.log('Clicked close elevator UI');
    $.post(`http://${RESOURCE_NAME}/closeElevatorUi`, JSON.stringify({}));
}

function setElevatorFloor(value) {
    console.log(`Chose elevator floor: ${value}`);
    $.post(`http://${RESOURCE_NAME}/setElevatorFloor`, JSON.stringify({ value }));
}

$(ELEVATOR_BUTTON).click(event => {
    console.log('Saw click');
    setElevatorFloor(event.target.textContent);
});

window.addEventListener('message', function(event) {
    const { type, value } = event.data;
    console.log(event.data);
    if (type === ELEVATOR_TYPE) {
        handleElevatorUi(value);
    }
})

document.onkeyup = data => {
    if (data.which == ESCAPE_KEY) {
        closeElevatorUi();
    }
}

$(ELEVATOR_CLOSE_BUTTON).click(closeElevatorUi);