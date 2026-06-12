import type { GenericCalcType } from './types';
import material_electrical_properties from '../../../../../datatables/data/material_electrical_properties';
import wire_gauge from '../../../../../datatables/data/wire_gauge';

const voltageDropInWire: GenericCalcType = {
  icon: 'simple-icons:wire',
  keywords: ['awg', 'gauge', 'resistivity', 'conductor'],
  path: 'cable-voltage-drop',
  formula: 'x = (((p * L) / (A/10**6) ) *2) * I',
  i18n: {
    name: 'number:voltageDropInWire.title',
    description: 'number:voltageDropInWire.description',
    shortDescription: 'number:voltageDropInWire.shortDescription',
    longDescription: 'number:voltageDropInWire.longDescription'
  },
  presets: [
    {
      title: 'number:voltageDropInWire.fields.material',
      source: material_electrical_properties,
      default: 'Copper',
      bind: {
        p: 'resistivity_20c'
      }
    },

    {
      title: 'number:voltageDropInWire.fields.wireGauge',
      source: wire_gauge,
      default: '24 AWG',
      bind: {
        A: 'area'
      }
    }
  ],

  extraOutputs: [
    {
      title: 'number:voltageDropInWire.fields.totalResistance',
      formula: '((p * L) / (A/10**6))*2',
      unit: 'Ω'
    },
    {
      title: 'number:voltageDropInWire.fields.totalPowerDissipated',
      formula: 'I**2 * (((p * L) / (A/10**6))*2)',
      unit: 'W'
    }
  ],
  variables: [
    {
      name: 'L',
      title: 'number:voltageDropInWire.fields.length',
      unit: 'meter',
      default: 1
    },
    {
      name: 'A',
      title: 'number:voltageDropInWire.fields.wireArea',
      unit: 'mm2',
      default: 1
    },

    {
      name: 'I',
      title: 'number:voltageDropInWire.fields.current',
      unit: 'A',
      default: 1
    },
    {
      name: 'p',
      title: 'number:voltageDropInWire.fields.resistivity',
      unit: 'Ω/m3',
      default: 1,
      defaultPrefix: 'n'
    },
    {
      name: 'x',
      title: 'number:voltageDropInWire.fields.voltageDrop',
      unit: 'V'
    }
  ]
};

export default voltageDropInWire;
