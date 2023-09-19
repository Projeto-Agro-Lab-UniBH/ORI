export function formatDateString(dataString: string): string {
  // Use uma expressão regular para extrair o ano, mês e dia
  const regex = /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/;

  // Verifique se a string corresponde à expressão regular
  const match = dataString.match(regex);

  if (!match) {
    return "Formato de data inválido";
  }

  const ano = match[1].substring(2); // Pega os dois últimos dígitos do ano
  const mes = match[2];
  const dia = match[3];

  // Formate a data no estilo "dd/mm/aa"
  const dataFormatada = `${dia}/${mes}/${ano}`;

  return dataFormatada;
}