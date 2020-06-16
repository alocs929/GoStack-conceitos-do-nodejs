const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepository(request, resposne, next){
  const {id} = request.params;
  
  if(!isUuid(id)){
    return resposne.status(400).json({ 
      error: 'Id invalid.'
    });
  }
  
  return next();
};


app.use('/repositories/:id', validateRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs,likes} = request.body;
  
  const repIndex = repositories.findIndex( rep => rep.id === id);
  if(repIndex < 0){
    return response.status(400).json({erro: 'Repository not found // ID.'});
  }

  console.log(repositories[repIndex]);
  console.log(" ");
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repIndex].likes,
  };
  console.log(repository);
  repositories[repIndex] = repository;
  return response.json(repository); 

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const repIndex = repositories.findIndex( rep => rep.id === id);
  if(repIndex < 0){
    return response.status(400).json({erro: 'Repository not found // ID.'});
  }
  repositories.splice(repIndex, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repository = repositories.find(rep => rep.id === id);
  repository.likes++;
  return response.json(repository);
});

module.exports = app;
