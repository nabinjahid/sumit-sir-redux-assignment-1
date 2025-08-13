// Action Types
const ADD_MATCH = "add_match";
const DELETE_MATCH = "delete_match";
const INCREMENT = "increment";
const DECREMENT = "decrement";
const RESET = "reset";

// Action Creators
const addMatch = () => ({ type: ADD_MATCH });
const deleteMatch = (id) => ({ type: DELETE_MATCH, payload: id });
const increment = (id, value) => ({
  type: INCREMENT,
  payload: { id, value }
});
const decrement = (id, value) => ({
  type: DECREMENT,
  payload: { id, value }
});
const reset = () => ({ type: RESET });

// Initial State
const initialState = {
  matches: [{ id: Date.now(), score: 0 }]
};

// Reducer
const scoreboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MATCH:
      return {
        ...state,
        matches: [...state.matches, { id: Date.now(), score: 0 }]
      };

    case DELETE_MATCH:
      return {
        ...state,
        matches: state.matches.filter(match => match.id !== action.payload)
      };

    case INCREMENT:
      return {
        ...state,
        matches: state.matches.map(match =>
          match.id === action.payload.id
            ? { ...match, score: match.score + action.payload.value }
            : match
        )
      };

    case DECREMENT:
      return {
        ...state,
        matches: state.matches.map(match =>
          match.id === action.payload.id
            ? { ...match, score: Math.max(match.score - action.payload.value, 0) }
            : match
        )
      };

    case RESET:
      return {
        ...state,
        matches: state.matches.map(match => ({ ...match, score: 0 }))
      };

    default:
      return state;
  }
};

// Store
const store = Redux.createStore(scoreboardReducer);

// Render Function
function render() {
  const state = store.getState();
  const container = document.getElementById("all-match-container");
  container.innerHTML = "";

  state.matches.forEach((match, index) => {
    const matchDiv = document.createElement("div");
    matchDiv.classList.add("match");
    matchDiv.dataset.id = match.id;

    matchDiv.innerHTML = `
      <div class="wrapper">
        <button class="lws-delete">
          <img src="./image/delete.svg" alt="delete" />
        </button>
        <h3 class="lws-matchName">Match ${index + 1}</h3>
      </div>
      <div class="inc-dec">
        <form class="incrementForm">
          <h4>Increment</h4>
          <input type="number" class="lws-increment" />
        </form>
        <form class="decrementForm">
          <h4>Decrement</h4>
          <input type="number" class="lws-decrement" />
        </form>
      </div>
      <div class="numbers">
        <h2 class="lws-singleResult">${match.score}</h2>
      </div>
    `;

    container.appendChild(matchDiv);
  });

  attachEvents();
}

// Attach Events
function attachEvents() {
  document.querySelectorAll(".lws-delete").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = Number(e.target.closest(".match").dataset.id);
      store.dispatch(deleteMatch(id));
    });
  });

  document.querySelectorAll(".incrementForm").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const id = Number(e.target.closest(".match").dataset.id);
      const value = Number(e.target.querySelector("input").value) || 0;
      store.dispatch(increment(id, value));
      e.target.reset();
    });
  });

  document.querySelectorAll(".decrementForm").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const id = Number(e.target.closest(".match").dataset.id);
      const value = Number(e.target.querySelector("input").value) || 0;
      store.dispatch(decrement(id, value));
      e.target.reset();
    });
  });
}

// Buttons
document.getElementById("addMatch").addEventListener("click", () => {
  store.dispatch(addMatch());
});
document.getElementById("resetButton").addEventListener("click", () => {
  store.dispatch(reset());
});

// Subscribe
store.subscribe(render);

// Initial Render
render();
