# First time run com Docker

## Configurações iniciais

Faça a configuração do arquivo **.env** conforme .env.example.

Inicialize seu gerenciador de pacotes para instalar todas as bibliotecas.

**Rode o seguinte comando no terminal para inicializar a aplicação:**

```bash
  sudo docker compose up
```

**Rode o seguinte comando para parar:**

```bash
  sudo docker compose down
```

---

# Documentação

## Rota Doc (swagger)

### Acesso a documentação

`GET /api-documentation`

## Rotas Users

### Cadastro de usuários

`POST /users - FORMATO DA REQUISIÇÃO `

```json
{
  "firstName": "Paulo",
  "lastName": "Claudio",
  "email": "pauloclaudio@mail.com",
  "age": 33,
  "password": "1234"
}
```

> Em caso de sucesso, a resposta será:

`POST /users - FORMATO DA RESPOSTA - STATUS 201`

```json
{
  "id": "29788820-4fa9-4d61-bb5c-5b8b5ac9f606",
  "firstName": "Paulo",
  "lastName": "Claudio",
  "email": "pauloclaudio@mail.com",
  "isAdm": false,
  "createdAt": "2022-05-28T15:36:36.696Z",
  "updatedAt": "2022-05-28T15:36:36.696Z",
  "courses": []
}
```

### Login de usuários

`POST /login - FORMATO DA REQUISIÇÃO `

```json
{
  "email": "pauloclaudio@mail.com",
  "password": "1234"
}
```

> Em caso de sucesso, a resposta será:

`POST /login - FORMATO DA RESPOSTA - STATUS 200`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU0NWFiMTBkLTJmZjUtNDRmYy1hMzM0LWQ3ZGZkMzk4OTJiYiIsImlhdCI6MTY1Mzc2MDMzNywiZXhwIjoxNjUzNzYzOTM3fQ.ECH1rK8WvGkzY2ghEP5TJW4ZD8cOjeGfyvgSwn9ZAfs"
}
```

### Atualização de usuários

`PATCH /users/:id - FORMATO DA REQUISIÇÃO `

**Bearer Token Required**

```json
{
  "firstName": "Pedro",
  "lastName": "Paulo",
  "email": "pedropaulo@mail.com",
  "age": 33,
  "password": "1234"
}
```

> Em caso de sucesso, a resposta será:

`PATCH /users/:id - FORMATO DA RESPOSTA - STATUS 200`

```json
{
  "id": "e45ab10d-2ff5-44fc-a334-d7dfd39892bb",
  "firstName": "Pedro",
  "lastName": "Paulo",
  "email": "pedropaulo@mail.com",
  "isAdm": false,
  "createdAt": "2022-05-28T17:46:57.980Z",
  "updatedAt": "2022-05-28T17:46:57.981Z",
  "courses": []
}
```

### Busca de um usuário

`GET /users/:id - NO BODY `

**Bearer Token Required**

> Em caso de sucesso, a resposta será:

`GET /users/:id - FORMATO DA RESPOSTA - STATUS 200`

```json
{
  "id": "e45ab10d-2ff5-44fc-a334-d7dfd39892bb",
  "firstName": "Pedro",
  "lastName": "Paulo",
  "email": "pedropaulo@mail.com",
  "isAdm": false,
  "createdAt": "2022-05-28T17:46:57.980Z",
  "updatedAt": "2022-05-28T17:46:57.981Z",
  "courses": []
}
```

### Busca de todos os usuários

`GET /users - NO BODY `

**Bearer Token Required - apenas usuários ADMIN**

> Em caso de sucesso, a resposta será:

`GET /users - FORMATO DA RESPOSTA - STATUS 200`

```json
[
  {
    "id": "e45ab10d-2ff5-44fc-a334-d7dfd39892bb",
    "firstName": "Pedro",
    "lastName": "Paulo",
    "email": "pedropaulo@mail.com",
    "isAdm": false,
    "createdAt": "2022-05-28T17:46:57.980Z",
    "updatedAt": "2022-05-28T17:46:57.981Z"
  },
  {
    "id": "af6d45ff-55f7-4ebe-87fc-15a9a97293e8",
    "firstName": "Claudio",
    "lastName": "Paulo",
    "email": "claudiopaulo@mail.com",
    "isAdm": true,
    "createdAt": "2022-05-28T17:46:57.980Z",
    "updatedAt": "2022-05-28T17:46:57.980Z"
  },
  {
    "id": "5e629f4d-6f80-4c44-a3de-9f30878631ec",
    "firstName": "Paulo",
    "lastName": "Claudio",
    "email": "pauloclaudio@mail.com",
    "isAdm": true,
    "createdAt": "2022-05-28T17:46:57.980Z",
    "updatedAt": "2022-05-28T17:46:57.980Z"
  }
]
```

## Rotas Courses

### Cadastro de cursos

`POST /courses - FORMATO DA REQUISIÇÃO `

**Bearer Token Required - apenas usuários ADMIN**

```json
{
  "courseName": "HTML5",
  "duration": "3 meses"
}
```

> Em caso de sucesso, a resposta será:

`POST /courses - FORMATO DA RESPOSTA - STATUS 201`

```json
{
  "id": "f5b22474-a500-4a54-a04f-c25edf8e852c",
  "courseName": "HTML5",
  "duration": "3 meses"
}
```

### Busca de todos os cursos

`GET /courses - NO BODY `

**Bearer Token Required - usuários ADMIN retornam os cursos com os estudantes**

> Em caso de sucesso, a resposta será (usuário não ADMIN):

`GET /courses - FORMATO DA RESPOSTA - STATUS 200`

```json
[
  {
    "id": "f5b22474-a500-4a54-a04f-c25edf8e852c",
    "courseName": "HTML5",
    "duration": "3 meses"
  },
  {
    "id": "b36d5f01-a191-4796-b1c0-4713cc5e52be",
    "courseName": "CSS3",
    "duration": "3 meses"
  },
  {
    "id": "4b56e541-90b3-4590-aa0d-83084ab135dd",
    "courseName": "JavaScript",
    "duration": "4 meses"
  }
]
```

> Em caso de sucesso, a resposta será (usuário ADMIN):

`GET /courses - FORMATO DA RESPOSTA - STATUS 200`

```json
[
  {
    "id": "f5b22474-a500-4a54-a04f-c25edf8e852c",
    "courseName": "HTML5",
    "duration": "3 meses",
    "student": []
  },
  {
    "id": "b36d5f01-a191-4796-b1c0-4713cc5e52be",
    "courseName": "CSS3",
    "duration": "3 meses",
    "student": []
  },
  {
    "id": "4b56e541-90b3-4590-aa0d-83084ab135dd",
    "courseName": "JavaScript",
    "duration": "4 meses",
    "student": [
      {
        "id": "5e629f4d-6f80-4c44-a3de-9f30878631ec",
        "firstName": "Paulo",
        "lastName": "Claudio",
        "email": "pauloclaudio@mail.com"
      }
    ]
  }
]
```

### Atualiza o curso

`PATCH /courses/:id - FORMATO DA REQUISIÇÂO `

```json
{
  "duration": "2 meses"
}
```

**Bearer Token Required - apenas usuários ADMIN**

> Em caso de sucesso, a resposta será:

`PATCH /courses/:id - FORMATO DA RESPOSTA - STATUS 200`

```json
[
  {
    "id": "f5b22474-a500-4a54-a04f-c25edf8e852c",
    "courseName": "HTML5",
    "duration": "2 meses"
  }
]
```
