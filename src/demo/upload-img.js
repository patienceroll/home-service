var input = document.createElement("input");

input.type = "file";

input.onchange = async (e) => {
  console.log(e);
  var formdata = new FormData();
  formdata.append("file", e.path[0].files[0]);
  console.log(e.path[0].files[0])
  fetch("http://localhost:3001/api/v1/upload/image", {
    method: "POST",
    body: formdata,
  });
};
input.click();
