import React, { createContext, useContext, useState } from 'react';

export const EditorContext = createContext();

export const useFileEditor = () => useContext(EditorContext);