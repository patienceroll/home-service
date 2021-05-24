var input = document.createElement("input");
input.type = "file";
input.onchange = async (e) => {
  console.log(e);
  var formdata = new FormData();
  formdata.append("file", e.path[0].files[0]);
  console.log(e.path[0].files[0]);
  fetch("http://localhost:3001/api/v1/upload/image", {
    method: "POST",
    body: formdata,
  });
};
input.click();

const login = function () {
  fetch("http://localhost:3001/api/v1/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      password: "123456",
      username: "test",
    }),
  });
};

const sign = function (username, password) {
  fetch("http://localhost:3001/api/v1/sign", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      password,
      username,
    }),
  });
};

const isLogin = function (authorization) {
  fetch("http://localhost:3001/api/v1/islogin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization,
    },
  });
};
