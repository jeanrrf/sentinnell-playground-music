import fs from 'fs-extra';
import { exec } from 'child_process';
import { spawn } from 'child_process'; // Para lidar com comandos externos no sistema

class AssistenteIA {
    constructor() {
        this.comandos = [];
        this.dadosLocais = {};
        this.historico = [];
    }

    aprenderComando(comando, acao) {
        console.log(`Aprendendo o comando: ${comando}`);
        this.comandos.push({ comando, acao });
    }

    executarComando(comando) {
        console.log(`Executando comando: ${comando}`);
        const acao = this.comandos.find(cmd => cmd.comando === comando);
        if (acao) {
            acao.acao();
        } else {
            console.log("Comando não reconhecido.");
        }
    }

    responderPergunta(pergunta) {
        console.log(`Respondendo à pergunta: ${pergunta}`);
        if (pergunta.includes("clima")) {
            return this.verificarPrevisaoTempoLocal("São Paulo");
        } else if (pergunta.includes("agenda")) {
            return this.verificarAgenda();
        } else {
            return "Desculpe, não tenho uma resposta para isso agora.";
        }
    }

    verificarPrevisaoTempoLocal(cidade) {
        const clima = {
            "São Paulo": { temp: 25, condicao: "Ensolarado" },
            "Rio de Janeiro": { temp: 30, condicao: "Parcialmente nublado" }
        };
        const dadosClima = clima[cidade];
        return dadosClima ? `Clima em ${cidade}: ${dadosClima.condicao}, Temp: ${dadosClima.temp}°C` : "Cidade não encontrada.";
    }

    verificarAgenda() {
        const eventos = [
            { titulo: "Reunião com equipe", horario: "10:00 AM" },
            { titulo: "Consulta médica", horario: "03:00 PM" }
        ];
        return eventos.map(e => `${e.titulo} às ${e.horario}`).join(", ");
    }

    alertaVoz(mensagem) {
        console.log(`Alerta: ${mensagem}`);
        exec(`say "${mensagem}"`);
    }

    aprenderHistorico() {
        console.log("Aprendendo a partir do histórico...");
        const frequencias = {};
        this.historico.forEach(cmd => {
            frequencias[cmd] = (frequencias[cmd] || 0) + 1;
        });
        console.log("Comandos mais usados:", frequencias);
    }

    armazenarHistorico(comando) {
        this.historico.push(comando);
        fs.writeFileSync('historico.json', JSON.stringify(this.historico), { encoding: 'utf8' });
    }

    iniciar() {
        console.log("Assistente AI iniciada...");
        this.executarComando("verificar clima");
        this.executarComando("verificar agenda");
        this.aprenderHistorico();
    }
}

const assistente = new AssistenteIA();
assistente.aprenderComando("verificar clima", () => assistente.alertaVoz(assistente.verificarPrevisaoTempoLocal("São Paulo")));
assistente.aprenderComando("verificar agenda", () => assistente.alertaVoz(assistente.verificarAgenda()));
assistente.iniciar();
// Modificação para adicionar reconhecimento de voz - teste

