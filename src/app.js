const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;
  const foundid = repositories.find(rep => rep.id === id);
  if (!foundid) {
    return response.status(400).json({ message: 'Repository id does not exist!' })
  }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const repo = {
    id: uuid(),
    ...request.body,
    likes: 0
  }
  repositories.push(repo);
  return response.json(repo);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);
  const likes = repositories[index].likes;
  // if (index < 0) {
  //   return response.status(404).json({ erro: 'Repository Id not found!' });
  // }
  const repo = {
    id,
    ...request.body,
    likes
  }
  repositories[index] = repo;
  return response.json(repo);
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => { repo.id === id });
  repositories.splice(index, 1);
  return response.status(204).send([]);
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);
  let { likes } = repositories[index];
  const repo = {
    ...repositories[index],
    'likes': likes + 1
  }
  repositories[index] = repo;
  return response.json(repo);
});

module.exports = app;
