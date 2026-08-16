import React, { useState } from 'react';
import { Search, Keyboard } from 'lucide-react';

export default function ShortcutsPage() {
  const [search, setSearch] = useState('');

  const shortcutGroups = [
    {
      title: 'General Commands',
      items: [
        { name: 'Open Command Palette', keys: ['Ctrl', 'K'] },
        { name: 'Save Project Node Graph', keys: ['Ctrl', 'S'] },
        { name: 'Toggle Quick Studio HUD', keys: ['Ctrl', 'H'] },
        { name: 'Undo Last Node Action', keys: ['Ctrl', 'Z'] },
      ]
    },
    {
      title: 'Navigation Shortcuts',
      items: [
        { name: 'Go to Home Landing', keys: ['G', 'H'] },
        { name: 'Go to Cinema Studio', keys: ['G', 'S'] },
        { name: 'Go to Node Canvas', keys: ['G', 'C'] },
        { name: 'Go to Soul ID Lab', keys: ['G', 'U'] },
      ]
    },
    {
      title: 'Generative Controls',
      items: [
        { name: 'Trigger Video Generation', keys: ['Ctrl', 'Enter'] },
        { name: 'Enhance Brief Prompt with AI', keys: ['Ctrl', 'E'] },
        { name: 'Toggle Aspect Ratio 16:9 / 9:16', keys: ['Shift', 'A'] },
        { name: 'Switch Active AI Model', keys: ['Shift', 'M'] },
      ]
    },
    {
      title: '3D Camera Orbit Rig',
      items: [
        { name: 'Toggle 3D Orbit Trajectory', keys: ['O'] },
        { name: 'FPV Drone Swoop Preset', keys: ['D'] },
        { name: 'Dolly Push In / Out', keys: ['W', 'S'] },
        { name: 'Pan Left / Right', keys: ['A', 'D'] },
      ]
    }
  ];

  return (
    <div className="account-subview-page">
      <div className="account-view-header">
        <h1 className="account-view-title">Keyboard Shortcuts</h1>
        <p className="account-view-desc">Work faster with keyboard commands inside GimbalFlow.</p>
      </div>

      {/* SEARCH INPUT */}
      <div className="search-box-wrap card-skeuo" style={{ padding: '12px', marginBottom: '24px' }}>
        <Search size={18} style={{ position: 'absolute', left: '20px', color: '#a19f8a' }} />
        <input 
          type="text" 
          className="form-input" 
          style={{ width: '100%', paddingLeft: '40px' }}
          placeholder="Search keyboard shortcuts..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CATEGORIES GRID */}
      <div className="shortcuts-categories-grid">
        {shortcutGroups.map(group => {
          const filteredItems = group.items.filter(i => 
            i.name.toLowerCase().includes(search.toLowerCase()) || 
            i.keys.join(' ').toLowerCase().includes(search.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={group.title} className="shortcut-category-card card-skeuo">
              <h3 className="category-title">{group.title}</h3>
              <div className="shortcut-items-list">
                {filteredItems.map(item => (
                  <div key={item.name} className="shortcut-item-row">
                    <span className="shortcut-name">{item.name}</span>
                    <div className="shortcut-keys">
                      {item.keys.map(k => (
                        <kbd key={k}>{k}</kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
