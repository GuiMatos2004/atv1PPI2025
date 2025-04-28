const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  const idadeNum = parseInt(idade);
  const salario = parseFloat(salario_base);
  const ano = parseInt(anoContratacao);
  const matriculaNum = parseInt(matricula);
  const anoAtual = new Date().getFullYear();
  const tempoEmpresa = anoAtual - ano;

  if (
    isNaN(idadeNum) || idadeNum <= 16 ||
    isNaN(salario) || salario <= 0 ||
    isNaN(ano) || ano <= 1960 ||
    isNaN(matriculaNum) || matriculaNum <= 0 ||
    (sexo !== 'M' && sexo !== 'F')
  ) {
    return res.send(`
      <h1>Dados inválidos!</h1>
      <p>Verifique se:</p>
      <ul>
        <li>Idade deve ser maior que 16</li>
        <li>Salário base deve ser um número real válido</li>
        <li>Ano de contratação deve ser maior que 1960</li>
        <li>Matrícula deve ser um inteiro maior que 0</li>
        <li>Sexo deve ser 'M' ou 'F'</li>
      </ul>
    `);
  }

  // Lógica de reajuste
  let reajustePercentual = 0;
  let valorExtra = 0;

  if (idadeNum >= 18 && idadeNum <= 39) {
    if (sexo === 'M') reajustePercentual = 0.10, valorExtra = tempoEmpresa > 10 ? 17 : -10;
    else reajustePercentual = 0.08, valorExtra = tempoEmpresa > 10 ? 16 : -11;
  } else if (idadeNum >= 40 && idadeNum <= 69) {
    if (sexo === 'M') reajustePercentual = 0.08, valorExtra = tempoEmpresa > 10 ? 15 : -5;
    else reajustePercentual = 0.10, valorExtra = tempoEmpresa > 10 ? 14 : -7;
  } else if (idadeNum >= 70 && idadeNum <= 99) {
    if (sexo === 'M') reajustePercentual = 0.15, valorExtra = tempoEmpresa > 10 ? 13 : -15;
    else reajustePercentual = 0.17, valorExtra = tempoEmpresa > 10 ? 12 : -17;
  }

  const novoSalario = (salario * (1 + reajustePercentual)) + valorExtra;

  res.send(`
    <h1>Dados do Funcionário</h1>
    <ul>
      <li><strong>Matrícula:</strong> ${matriculaNum}</li>
      <li><strong>Idade:</strong> ${idadeNum} anos</li>
      <li><strong>Sexo:</strong> ${sexo}</li>
      <li><strong>Salário Base:</strong> R$ ${salario.toFixed(2)}</li>
      <li><strong>Ano de Contratação:</strong> ${ano}</li>
      <li><strong>Tempo de Empresa:</strong> ${tempoEmpresa} anos</li>
    </ul>
    <h2 style="color: green;">Novo Salário Reajustado: R$ ${novoSalario.toFixed(2)}</h2>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
