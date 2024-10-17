var http = require('http');
var fs = require('fs');
var url = require('url');
const sqlite3 = require('sqlite3').verbose();
http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var nomearquivo = "." + q.pathname;
    if(nomearquivo == "./"){
        fs.readFile("index.html", function(err, data) {
            if(err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Arquivo não encontrado!");
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
    });
}
else if(nomearquivo== './formulario.html'){
  fs.readFile(nomearquivo, function(err, data) {
    if(err){
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Arquivo não encontrado!");
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}
else if( nomearquivo == './registra'){
    let nome = q.query.nome;
    let raca = q.query.raca;
    let temporada = q.query.temporada;
    let nascimento = q.query.nascimento;
    let db = new sqlite3.Database('./db/banco.db', (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Conectou com Banco de dados');
      });
      db.run(`INSERT INTO personagens(nome, raca, temporadaAparecida, nascimento) VALUES(?,?,?,?)`, [nome, raca, temporada, nascimento], function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`Registro feito com sucesso no id ${this.lastID}`);
      });
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Fechou a conexão com o Banco de dados');
      });
      res.writeHead(200, ('Content-Type', 'text/html'));
      res.write('<p>Registro efetuado com sucesso!<p>');
      res.write("<p><a href='/'> Voltar </a></p>");

      return res.end();
}
else if (nomearquivo == "./ver_personagem"){
  res.writeHead(200, {'Content-Type': 'text/html'}); 
  res.write("<html><head><meta charset='UTF-8'></head><body>");
  res.write('<style> body { background-color: #8ecae6; color: #01497c } th {border: solid 1px ; color: #003049} td {border:solid 1px ; color: #01497c }  #indo{margin-left: 41%;margin-top: 13%;} </style>')
  let db = new sqlite3.Database('./db/banco.db', (err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('conectou com o banco de dados!')
  })    

  db.all('SELECT * FROM personagens', {}, (err, rows) => {
    if(err) {
      throw err;
    }
    res.write('<table id="indo">');
    res.write("<h1> Personagens listado abaixo</h1> <p>");
    res.write('<p>Personagens listados abaixo xxx');
    res.write('<tr>');
    res.write('<th>Nome</th>');
    res.write('<th>Raca</th>');
    res.write('<th>Temporada</th>');
    res.write('<th>Nascimento</th>');
    res.write('</tr>');
    rows.forEach((row) => {
      res.write('<tr>');
      res.write('<td>'+ row.nome+'</td>');
      res.write('<td>'+ row.raca+'</td>');
      res.write('<td>'+ row.temporada+'</td>');
      res.write('<td>'+ row.nascimento+'</td>');
      res.write('</tr>');
    });
    res.write('</table>');
    res.write("<p><a href='/'> Voltar </a></p>");
    res.write("</body></html>");
    return res.end();
  });
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Fechou a conexão com o banco de dados!')
  })
}
}).listen(8080, () => {
    console.log("O servidor foi iniciado na porta 8080");
});
