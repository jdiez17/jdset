import SolarPanelEfficiency from "./components/SolarPanelEfficiency";
import OrbitalParameterSimulator from "./components/OrbitalParameterSimulator";

const modules = [ 
  {
    'name': 'Solar Panel Efficiency',
    'path': '/solar-panel-efficiency',
    'component': SolarPanelEfficiency
  },
  {
    'name': 'Kepler Orbit Simulator',
    'path': '/kepler-orbit-simulator',
    'component': OrbitalParameterSimulator
  }
]

export default modules;
