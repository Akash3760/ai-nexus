import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import "ag-grid-community/styles/ag-theme-quartz.css";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import './index.css'
import "./styles/ag-grid.css";

import App from './App.jsx'

ModuleRegistry.registerModules([
  AllCommunityModule,
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
