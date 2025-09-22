function calcularDosagem() {
    // Obtenção dos valores do formulário
    const fck = parseInt(document.getElementById('fck').value);
    const slump = document.getElementById('slump').value;
    const brita = parseInt(document.getElementById('brita').value);
    const cimento = parseInt(document.getElementById('cimento').value);
    const areia = parseInt(document.getElementById('areia').value);
    const umidadeAreia = parseFloat(document.getElementById('umidadeAreia').value) / 100;
    const umidadeBrita = parseFloat(document.getElementById('umidadeBrita').value) / 100;

    // Tabelas de referência
    const volumeAguaTabela = {
        "40-60": [220, 195, 180],
        "60-80": [225, 200, 185],
        "80-100": [230, 205, 190],
        "120-150": [240, 215, 200]
    };

    const fatorAguaCimentoTabela = {
        15: [0.627, 0.712, 0.797, 0.8],
        20: [0.516, 0.611, 0.691, 0.709],
        25: [0.434, 0.525, 0.61, 0.627],
        30: [null, 0.461, 0.541, 0.56],
        35: [null, 0.401, 0.484, 0.501],
        40: [null, null, 0.435, 0.452]
    };

    const volumeAgregadoGraudoTabela = {
        0: [0.645, 0.565, 0.505],
        1: [0.77, 0.69, 0.63],
        2: [0.845, 0.765, 0.705]
    };

    // Constantes
    const densidadeCimento = 3150; // kg/m³
    const densidadeAreia = 2650; // kg/m³
    const densidadeBrita = 2700; // kg/m³
    const densidadeAgua = 1000; // kg/m³
    const volumetricaAreia = 1500; // kg/m³
    const volumetricaBrita = 1450; // kg/m³

    // Cálculos
    const volumeAgua = volumeAguaTabela[slump][brita]; // Volume de água em litros
    const fatorAguaCimento = fatorAguaCimentoTabela[fck][cimento - 1];
    const volumeBrita = volumeAgregadoGraudoTabela[brita][areia - 1];

    const quantidadeCimento = volumeAgua / fatorAguaCimento; // Quantidade de cimento em kg
    const quantidadeAgua = quantidadeCimento * fatorAguaCimento; // Volume de água em litros
    const quantidadeBrita = volumeBrita * 1500 * (1 + umidadeBrita); // Peso da brita em kg

    const volumeAreia = 1 - ((quantidadeCimento / densidadeCimento) + (quantidadeBrita / densidadeBrita) + (quantidadeAgua / densidadeAgua));
    const quantidadeAreia = volumeAreia * densidadeAreia * (1 + umidadeAreia); // Peso da areia em kg

    const volumeConcreto = (quantidadeCimento / densidadeCimento) + (quantidadeAreia / densidadeAreia) + (quantidadeBrita / densidadeBrita) + (quantidadeAgua / densidadeAgua);

    // Cálculos dos novos campos
    const pesoAreiaReal = quantidadeAreia * (1 + umidadeAreia); // Peso real da areia em kg
    const volumeRealAreia = pesoAreiaReal / volumetricaAreia; // Volume real da areia em m³

    const pesoBritaReal = quantidadeBrita * (1 + umidadeBrita); // Peso real da brita em kg
    const volumeRealBrita = pesoBritaReal / volumetricaBrita; // Volume real da brita em m³

    const volumeRealAgua = (quantidadeAgua - (quantidadeAreia * umidadeAreia + quantidadeBrita * umidadeBrita)) / 1000; // Volume real da água em litros

    // Cálculo da quantidade de areia, brita e água em baldes
    const quantidadeAreiaBaldes = (volumeRealAreia * (50 / quantidadeCimento)) / 0.018;
    const quantidadeBritaBaldes = (volumeRealBrita * (50 / quantidadeCimento)) / 0.018;
    const quantidadeAguaBaldes = (volumeRealAgua * (50 / quantidadeCimento)) / 0.018;
    const rendimento = 50 / quantidadeCimento;

    // Exibição dos resultados
    document.getElementById('resultado').innerHTML = `
        Quantidade de Cimento: 50 kg (1 saco)<br>
        Quantidade de Areia: ${quantidadeAreiaBaldes.toFixed(2)} Baldes 18L <br>
        Quantidade de Brita: ${quantidadeBritaBaldes.toFixed(2)} Baldes 18L <br>
        Volume de água: ${quantidadeAguaBaldes.toFixed(2)} Baldes 18L <br>
        Rendimento do traço de concreto: ${rendimento.toFixed(3)} m³
    `;

    document.getElementById('memorial').innerHTML = `
        <h3>Memorial de Cálculo</h3>
        Relação água/cimento: ${fatorAguaCimento.toFixed(3)}<br>
        Dmax: ${brita === 0 ? "9,5 mm" : brita === 1 ? "19 mm" : "25 mm"}<br>
        Volume de brita: ${volumeBrita.toFixed(2)} m³<br>
        Volume de areia: ${volumeAreia.toFixed(2)} m³<br>
        Volume de água: ${volumeAgua.toFixed(2)} Litros<br><br>
        Consumo de cimento por m³: ${quantidadeCimento.toFixed(2)} kg<br>
        Consumo de agregado graúdo por m³: ${quantidadeBrita.toFixed(2)} kg<br>
        Consumo de agregado miúdo por m³: ${quantidadeAreia.toFixed(2)} kg<br><br>
        Peso da Areia Real: ${pesoAreiaReal.toFixed(2)} kg<br>
        Peso da Brita Real: ${pesoBritaReal.toFixed(2)} kg<br><br>
        Volume Real da Areia: ${volumeRealAreia.toFixed(3)} m³<br>
        Volume Real da Brita: ${volumeRealBrita.toFixed(3)} m³<br>
        Volume Real da Água: ${volumeRealAgua.toFixed(2)} m³
    `;
}
