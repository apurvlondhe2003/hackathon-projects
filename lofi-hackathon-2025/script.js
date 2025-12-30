/** @format */

document.addEventListener("DOMContentLoaded", () => {
	/* ========= DOM HELPERS ========= */
	const $ = (selector) => document.querySelector(selector);

	const getInput = $("#inputField");
	const task = $(".task");
	const noTask = $(".no-task");
	const status = $(".right");
	const deleteBtn = $(".delete-all");
	const dateTime = $(".date-time");
	const taskList = $(".task-list");
	const form = $("form");
	const progressBar = $(".progress-wrapper");
	const progressFill = $(".progressFill");
	const progressText = $(".progressText");

	//** Add Local Storage Data other wise Empty Array */
	let localTodoList = JSON.parse(localStorage.getItem("Todo")) || [];

	//** Add New Data for Local Storage */
	const addNewLocalStorageData = () => {
		localStorage.setItem("Todo", JSON.stringify(localTodoList));
	};

	//** Complete Count Status */
	const completeCount = () =>
		localTodoList.filter((item) => item.status).length;

	// //* Date & Time
	setInterval(() => {
		const newDate = new Date();
		dateTime.innerHTML = `
		<p>${newDate.toLocaleDateString()}</p>
		<p>${newDate.toLocaleTimeString("en-US", { hour12: true })} </p>`;
	}, 1000);

	const updatedProgress = () => {
		if (localTodoList.length === 0) {
			progressBar.style.display = "none";
			return;
		}

		const percent = (completeCount() / localTodoList.length) * 100;

		progressBar.style.display = "block";
		progressFill.style.width = percent + "%";
		progressText.innerText = `${Math.round(percent)}% Completed`;
	};

	//* Render UI
	const render = () => {
		task.querySelectorAll("li").forEach((li) => li.remove());

		noTask.style.display = "none";
		deleteBtn.style.display = localTodoList.length >= 2 ? "block" : "none";

		if (localTodoList.length === 0) {
			noTask.style.display = "block";
			status.innerHTML = `0 Task`;

			updatedProgress();
			addNewLocalStorageData();
			return;
		}

		localTodoList.forEach(({ id, value, status }) => {
			const listDiv = document.createElement("li");
			listDiv.classList.add(status ? "done" : "notDone");
			listDiv.innerHTML = `
			<p class="${status ? "completed" : ""}">${value}</p>
			<div>
			<i class="fa-solid fa-check" data-id=${id}></i>
			<i class="fa-solid fa-delete-left" data-id=${id}></i>
			</div>`;

			task.append(listDiv);
		});

		status.innerText = `${completeCount()} of ${localTodoList.length}`;
		updatedProgress();
		addNewLocalStorageData();
	};

	//** Add todo List - Function Call */
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const value = getInput.value.trim().toLowerCase();

		if (!value || localTodoList.find((currElem) => currElem.value === value)) {
			getInput.value = "";
			return;
		}

		localTodoList.push({ id: Date.now(), value, status: false });
		getInput.value = "";
		render();
	});

	deleteBtn.addEventListener("click", () => {
		localTodoList = [];
		render();
	});

	//** Remove Todo List Data One by One - Function Call */
	taskList.addEventListener("click", (e) => {
		const index = Number(e.target.dataset.id);
		if (!index) return;

		if (e.target.classList.contains("fa-delete-left"))
			localTodoList = localTodoList.filter((currElem) => currElem.id !== index);

		if (e.target.classList.contains("fa-check"))
			localTodoList = localTodoList.map((currElem) =>
				currElem.id === index
					? { ...currElem, status: !currElem.status }
					: currElem
			);

		render();
	});

	render();
});
