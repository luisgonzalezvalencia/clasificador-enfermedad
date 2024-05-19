import { Component } from '@angular/core';

interface Sintomas {
  fiebre: boolean;
  fatiga: boolean;
  tos: boolean;
  estornudos: boolean;
  dolorMuscular: boolean;
  mocos: boolean;
  dolorGarganta: boolean;
  diarrea: boolean;
  dolorCabeza: boolean;
  dificultadRespiratoria: boolean;
  vomitos: boolean;
  dolorDeOjos: boolean;
  malestarGral: boolean;
  erupcionPiel: boolean;
}

interface Sintoma {
  key: keyof Sintomas;
  label: string;
  id: string;
}

interface EnfermedadesPuntajes {
  covid: number;
  gripe: number;
  resfrio: number;
  dengue: number;
}

interface UltimasPredicciones {
  nombre: string;
  apellido: string;
  ultimasPredicciones: EnfermedadesPuntajes;
  resultado: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public nombre = '';
  public apellido = '';
  public step: number = 1;
  sintomas: Sintomas = {
    fiebre: false,
    fatiga: false,
    tos: false,
    estornudos: false,
    dolorMuscular: false,
    mocos: false,
    dolorGarganta: false,
    diarrea: false,
    dolorCabeza: false,
    dificultadRespiratoria: false,
    vomitos: false,
    dolorDeOjos: false,
    malestarGral: false,
    erupcionPiel: false
  };

  sintomasList: Sintoma[] = [
    { key: 'fiebre', label: 'Fiebre', id: 'fiebre' },
    { key: 'fatiga', label: 'Fatiga', id: 'fatiga' },
    { key: 'tos', label: 'Tos', id: 'tos' },
    { key: 'estornudos', label: 'Estornudos', id: 'estornudos' },
    { key: 'dolorMuscular', label: 'Dolor Muscular', id: 'dolorMuscular' },
    { key: 'mocos', label: 'Mocos', id: 'mocos' },
    { key: 'dolorGarganta', label: 'Dolor de Garganta', id: 'dolorGarganta' },
    { key: 'diarrea', label: 'Diarrea', id: 'diarrea' },
    { key: 'dolorCabeza', label: 'Dolor de Cabeza', id: 'dolorCabeza' },
    { key: 'dificultadRespiratoria', label: 'Dificultad para Respirar', id: 'dificultadRespiratoria' },
    { key: 'vomitos', label: 'Vómitos', id: 'vomitos' },
    { key: 'dolorDeOjos', label: 'Dolor Retro-Ocular', id: 'dolorDeOjos' },
    { key: 'malestarGral', label: 'Malestar General', id: 'malestarGral' },
    { key: 'erupcionPiel', label: 'Erupción de la Piel', id: 'erupcionPiel' }
  ];
  message: string = '';

  messageError: string = '';

  public probabilidades: EnfermedadesPuntajes = { covid: 0, gripe: 0, resfrio: 0, dengue: 0 };

  public ultimasPredicciones: UltimasPredicciones[] = [];

  public temperaturaFiebre?: number;

  public error: boolean = false;

  constructor() {

  }

  next() {
    this.step += 1;
  }

  evaluarRiesgo() {
    this.error = false;
    // Implementar evaluación de riesgo
    console.log(this.sintomas);
    let cantidadTrue = 0;

    Object.entries(this.sintomas).forEach(([key, val]) => {
      if (val) {
        cantidadTrue += 1;
      }
    });

    console.log(cantidadTrue);
    if (cantidadTrue >= 2) {



      let resultados = this.motorInference();
      this.message = `La(s) enfermedad(es) más probable(s): ${resultados.mostLikelyDiseases.join(', ')}.`
      this.probabilidades = resultados.probabilidades;

      this.ultimasPredicciones.push(
        {
          nombre: this.nombre,
          apellido: this.apellido,
          ultimasPredicciones: this.probabilidades,
          resultado: resultados.mostLikelyDiseases.join(', ')
        }
      );

      this.step = 3;
    } else {
      this.messageError = 'Por favor, seleccione al menos 2 sintomas para poder evaluar su riesgo.';
      this.error = true;
    }

  }


  reiniciar() {
    this.step = 1;
    this.sintomas = {} as Sintomas;
    this.message = '';
    this.temperaturaFiebre = undefined;
    this.error = false;
    this.messageError = '';
    this.nombre = '';
    this.apellido = '';
  }

  irAHistorial() {
    this.step = 4;
  }

  motorInference() {
    // voy a sumar puntos segun cuan frecuente es el sintoma en dicha enfermedad
    //"Frecuente": 3 puntos.
    // "A veces": 2 puntos.
    // "Infrecuente": 1 punto.
    // "No": 0 puntos.
    const puntajes: EnfermedadesPuntajes = {
      covid: 0,
      gripe: 0,
      resfrio: 0,
      dengue: 0
    };

    if (this.sintomas.fiebre) {
      //en caso de fiebre alta, incrementamos la prob de dengue
      if (this.temperaturaFiebre && this.temperaturaFiebre >= 39) {
        puntajes['covid'] += 1;
        puntajes['gripe'] += 1;
        puntajes['resfrio'] += 1;
        puntajes['dengue'] += 3;
      } else {
        puntajes['covid'] += 2;
        puntajes['gripe'] += 2;
        puntajes['resfrio'] += 1;
        puntajes['dengue'] += 2;
      }
    }
    if (this.sintomas.tos) {
      puntajes['covid'] += 3;
      puntajes['gripe'] += 3;
      puntajes['resfrio'] += 2;
    }
    if (this.sintomas.dolorMuscular) {
      puntajes['covid'] += 2;
      puntajes['gripe'] += 3;
      puntajes['resfrio'] += 3;
      puntajes['dengue'] += 1;
    }
    if (this.sintomas.estornudos) {
      puntajes['resfrio'] += 3;
    }
    if (this.sintomas.mocos) {
      puntajes['gripe'] += 2;
      puntajes['resfrio'] += 3;
    }
    if (this.sintomas.dolorGarganta) {
      puntajes['covid'] += 2;
      puntajes['gripe'] += 2;
      puntajes['resfrio'] += 3;
    }
    if (this.sintomas.diarrea) {
      puntajes['covid'] += 1;
      puntajes['gripe'] += 2;
      puntajes['dengue'] += 3;
    }
    if (this.sintomas.dolorCabeza) {
      puntajes['covid'] += 2;
      puntajes['gripe'] += 3;
      puntajes['dengue'] += 3;
    }
    if (this.sintomas.dificultadRespiratoria) {
      puntajes['covid'] += 2;
    }
    if (this.sintomas.vomitos) {
      puntajes['gripe'] += 3;
      puntajes['dengue'] += 3;
    }
    if (this.sintomas.dolorDeOjos) {
      puntajes['dengue'] += 3;
    }
    if (this.sintomas.malestarGral) {
      puntajes['dengue'] += 3;
    }
    if (this.sintomas.erupcionPiel) {
      puntajes['dengue'] += 3;
    }

    const maxScore = Math.max(puntajes.covid, puntajes.gripe, puntajes.resfrio, puntajes.dengue);
    const likelyDiseases = Object.keys(puntajes) as (keyof EnfermedadesPuntajes)[];
    const mostLikelyDiseases = likelyDiseases.filter(key => puntajes[key] === maxScore);

    let totalPuntos = puntajes.covid + puntajes.gripe + puntajes.resfrio + puntajes.dengue;
    let probabilidadCadaUno = {
      covid: (puntajes.covid / totalPuntos) * 100,
      gripe: (puntajes.gripe / totalPuntos) * 100,
      resfrio: (puntajes.resfrio / totalPuntos) * 100,
      dengue: (puntajes.dengue / totalPuntos) * 100
    }

    return {
      probabilidades: probabilidadCadaUno,
      maxScore: maxScore,
      mostLikelyDiseases: mostLikelyDiseases
    }
  }
}
