(async function(d) {
  let pieData = await fetchPies();
  let sent = pieData.sent;
  let eaten = pieData.eaten;
  let total = pieData.total;
  let pies = pieData.pies;
  const piesTable = d.querySelector(".pies__list");

  drawPies(pies);

  function drawPies(pies) {
    pies.forEach(function(pie) {
      const pieRow = d.createElement("tr");
      const pieId = d.createElement("td");
      const pieSender = d.createElement("td");
      const pieRecipient = d.createElement("td");
      const pieSentAt = d.createElement("td");
      const pieEatenAt = d.createElement("td");

      pieId.innerHTML = pie.id;
      pieSender.innerHTML = pie.senderName;
      pieRecipient.innerHTML = pie.recipientName;

      if (pie.sentAt) {
        pieSentAt.innerHTML = new Date(pie.sentAt);
      }
      if (pie.eatenAt) {
        pieEatenAt.innerHTML = new Date(pie.eatenAt);
      }
      if (pie.sentAt && !pie.eatenAt) {
        const pieEatButton = d.createElement("button");
        pieEatButton.innerHTML = "Eat Pie";
        pieEatButton.classList.add("eat-button");
        pieEatButton.dataset.id = pie.id;
        // pieEatButton.href = `https://eatchocopietogether.com/pies/${pie.id}/eatWithoutNotification?recipientEmail=${pie.recipientEmail}`
        pieEatenAt.append(pieEatButton);

        pieEatenAt.append(" | ");

        const pieReminderButton = d.createElement("button");
        pieReminderButton.innerHTML = "Send Reminder";
        pieReminderButton.classList.add("reminder-button");
        pieReminderButton.dataset.id = pie.id;
        // pieReminderButton.href = `https://eatchocopietogether.com/pies/${pie.id}/sendEatReminder?recipientEmail=${pie.recipientEmail}`
        pieEatenAt.append(pieReminderButton);
      }

      pieRow.append(pieId);
      pieRow.append(pieSender);
      pieRow.append(pieRecipient);
      pieRow.append(pieSentAt);
      pieRow.append(pieEatenAt);

      piesTable.append(pieRow);
    });
  }

  d.addEventListener("click", async function(e) {
    if (e.target.classList.contains("eat-button")) {
      const okay = confirm("Are you sure you want to eat this pie?");
      if (okay) {
        await eatPie(e.target.dataset.id);
        window.location.replace("/manage");
      }
    } else if (e.target.classList.contains("reminder-button")) {
      const okay = confirm("Are you sure you want to send a reminder email");
      if (okay) {
        // sendReminder(e.target.dataset.id);
        window.location.replace("/manage");
      }
    }
  });

  async function eatPie(pieId) {
    const req = await fetch(`/pies/${pieId}/eatWithoutNotification`, {
      method: "post",
      body: JSON.stringify({ pieId }),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await req.json();
    return resp;
  }

  async function sendReminder(pieId) {
    const req = await fetch(`/pies/${pieId}/sendReminder`, {
      method: "post",
      body: JSON.stringify({ pieId }),
      headers: { "Content-Type": "application/json" }
    });
    const resp = await req.json();
    return resp;
  }

  // async function sendPie(pieId, data) {
  //   const req = await fetch("/pies", {
  //     method: "post",
  //     body: JSON.stringify({ pieId, data }),
  //     headers: { "Content-Type": "application/json" }
  //   });
  //   const resp = await req.json();
  //   return resp;
  // }

  async function fetchPies() {
    const req = await fetch("/pies");
    const resp = await req.json();
    return resp;
  }
})(document);
