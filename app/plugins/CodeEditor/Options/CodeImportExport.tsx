import * as fs from 'fs';
import * as React from 'react';
import { remote } from 'electron';
import { Button, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

interface CodeImportExportProps {
  pluginState: any;
  updateCurrentPlugin: Function;
}

const CodeImportExport = ({ pluginState, updateCurrentPlugin }: CodeImportExportProps) => {
  const { snippet } = pluginState;

  const selectCodeFileToImport: React.MouseEventHandler<HTMLElement> = () => {
    remote.dialog.showOpenDialog((filePaths: string[]) => {
      if (!filePaths) return;
      fs.readFile(filePaths[0], (err: any, data: any) => {
        if (err) return;
        updateCurrentPlugin({ snippet: data.toString() });
      });
    });
  };

  const selectCodeFileToExport: React.MouseEventHandler<HTMLElement> = () => {
    remote.dialog.showSaveDialog((filename: string) => {
      if (!filename) return;
      fs.writeFile(filename, JSON.stringify(snippet, null, 2));
    });
  };

  return (
    <li>
      <Popover 
        content="Import"
        interactionKind={ PopoverInteractionKind.HOVER }
        position={ Position.TOP }
        useSmartPositioning={ false } >
        <Button
          iconName="import"
          text="Import"
          onClick={ selectCodeFileToImport } />
      </Popover>
      <div style={{ marginTop: '5px'}}></div>
      <Popover 
        content="Export"
        interactionKind={ PopoverInteractionKind.HOVER }
        position={ Position.TOP }
        useSmartPositioning={ false } >
        <Button
          iconName="export"
          text="Export"
          onClick={ selectCodeFileToExport } />
      </Popover>
    </li>
  );
};


export default CodeImportExport;