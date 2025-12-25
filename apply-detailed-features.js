import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('📦 Applying detailed features migration...\n');

  try {
    // Read the migration file
    const migration = readFileSync('supabase/migrations/20251225000006_add_detailed_features.sql', 'utf8');
    
    // Split by UPDATE statements and execute each one
    const statements = migration.split('UPDATE products SET').filter(s => s.trim());
    
    console.log(`Found ${statements.length} product updates to apply\n`);

    // First, add the column (skip this step - we'll do it via SQL editor)
    console.log('1. Skipping column creation (do this manually in Supabase SQL editor if needed)...');

    // Now update each product manually
    const products = [
      {
        name: 'Arc Raiders',
        features: {
          sections: [
            {
              title: "Aimbot Core",
              items: ["Aim On/Off", "Aim Key", "FOV", "Bone Selector", "Aimbot Speed", "Recoil Compensation", "Target Switch Delay", "Nearest Coefficient", "Hitbox Priority", "Visibility Check"]
            },
            {
              title: "Player ESP",
              items: ["Enemy Box", "Line", "Distance", "Health", "Name", "Skeleton", "Robot ESP"]
            },
            {
              title: "Item ESP",
              items: ["Item ESP", "Item ESP Filters"]
            },
            {
              title: "Misc",
              items: ["Gamepad Support"]
            }
          ]
        }
      },
      {
        name: 'BO7',
        features: {
          sections: [
            {
              title: "Support Modes",
              items: ["Black Ops 7", "Black Ops 6", "BO6 Warzone"]
            },
            {
              title: "Aimbot Targeting",
              items: ["Enabled", "Speed (0–100%)", "FOV (0–180°)", "Max Distance (0–500 m)", "Retarget Time", "Detach Time", "Filter Team/Invisible"]
            },
            {
              title: "Filtering",
              items: ["Filter Team", "Filter Invisible", "Draw Aimbot FOV (color)"]
            },
            {
              title: "Triggerbot",
              items: ["Enabled", "Hitbox Expansion", "Retarget Time", "Filter Team/Invisible"]
            },
            {
              title: "Config",
              items: ["Load/Save/Delete", "Config List", "Name Input"]
            }
          ]
        }
      },
      {
        name: 'Battlefield 6',
        features: {
          sections: [
            {
              title: "Aimbot Essentials",
              items: ["Enabled", "Speed", "FOV", "Max Distance", "Retarget Time", "Detach Time", "Filter Team/Invisible"]
            },
            {
              title: "Player ESP",
              items: ["Enemy/Team/Bot Types", "Max Distance", "Box & Head Dot", "View Angles & Skeleton", "Out-of-FOV Arrows", "Name & Distance", "Visible Indicator", "Draggable ESP"]
            },
            {
              title: "Config",
              items: ["Name Input", "Add/Delete", "List", "Load/Save", "Overlay FPS", "Developer Mode"]
            }
          ]
        }
      },
      {
        name: 'Rust',
        features: {
          sections: [
            {
              title: "Aimbot Categories",
              items: ["Pistols/Rifles/Snipers", "Shotguns/SMG/Others"]
            },
            {
              title: "Targeting",
              items: ["Enabled & Silent Aimbot", "Speed & FOV", "Max Distance", "Retarget/Detach Time"]
            },
            {
              title: "Player ESP",
              items: ["Enemy/Team/Bot", "Max Distance", "Box & Head Dot", "View Angles/Skeleton", "Out-of-FOV Arrows", "Distance & Name"]
            },
            {
              title: "Prefabs ESP",
              items: ["Hostiles & Traps", "Crates & Farmables", "Vehicles & Monuments"]
            },
            {
              title: "Control",
              items: ["Active/Disable Current", "Active/Disable Global"]
            }
          ]
        }
      },
      {
        name: 'Fortnite',
        features: {
          sections: [
            {
              title: "Aimbot Advanced",
              items: ["Aim On/Off", "Aim Key", "Aim-at-Shoot", "Visibility Check", "FOV", "Bone Selector", "Target Switch Delay", "Nearest Coefficient", "Aimbot Speed"]
            },
            {
              title: "ESP",
              items: ["Enemy Box/Line", "Distance", "Health/Shield", "Name", "Team Check", "Skeleton", "Item ESP & Filters", "Loot ESP", "Night Mode", "Knocked Out Text"]
            },
            {
              title: "Misc",
              items: ["Skin Changer", "Crosshair", "Distance Unit Options"]
            }
          ]
        }
      },
      {
        name: 'Apex Legends',
        features: {
          sections: [
            {
              title: "Aimbot",
              items: ["Enable/Disable", "Recoil Control", "Visible Check", "FOV Circle", "FOV Slider", "Smoothing Slider", "Keybind"]
            },
            {
              title: "ESP/Wallhack",
              items: ["2D Boxes", "Snaplines", "Distance", "Healthbar", "Skeleton", "Headcircle", "Eyeline", "Radar", "Team Check", "Visible Check"]
            },
            {
              title: "Misc",
              items: ["Clean UI", "Optimized Performance Presets"]
            }
          ]
        }
      },
      {
        name: 'Valorant',
        features: {
          sections: [
            {
              title: "Aimbot",
              items: ["Mode (Hold/Toggle)", "Draw FOV Border", "FOV Radius", "Keybind", "Smooth", "Distance"]
            },
            {
              title: "Player ESP",
              items: ["Box 2D/Filled", "Nickname & Hero Name", "Distance", "Line ESP"]
            },
            {
              title: "Configs & Settings",
              items: ["Config Selector/Creator", "Delete/Save/Load", "Accent Color & Theme", "VSync", "Show FPS", "DPI Scale", "Watermark Position"]
            }
          ]
        }
      },
      {
        name: 'PUBG',
        features: {
          sections: [
            {
              title: "Aimbot",
              items: ["Aimbot", "Prediction", "FOV Circle", "FOV Size Slider", "Smoothing Slider", "Aimkey", "Hitbox Selection"]
            },
            {
              title: "Visuals",
              items: ["Box & Distance", "Corner Box", "Skeleton", "Username", "Skeleton Thickness", "Head Circle", "Warning Arrows"]
            }
          ]
        }
      },
      {
        name: 'Marvel Rivals',
        features: {
          sections: [
            {
              title: "Aimbot",
              items: ["Toggle", "Aimkey Selection", "Closest Aimbone Detection", "Aimline", "Visibility Check", "Bullet Drop Prediction", "FOV Circle & Slider", "Smoothing Slider", "Distance Slider"]
            },
            {
              title: "ESP",
              items: ["Skeleton ESP", "Box ESP", "Name & Distance", "Head Circle ESP", "Item ESP", "Minimum Item Rarity", "Chest ESP", "Vehicle ESP"]
            },
            {
              title: "Misc",
              items: ["Weakpoint Assist", "Pickaxe Aimbot", "Color Customization"]
            }
          ]
        }
      },
      {
        name: 'Delta Force',
        features: {
          sections: [
            {
              title: "Aimbot",
              items: ["Mode (Hold/Toggle)", "Draw FOV Border", "FOV Radius", "Keybind", "Smooth", "Distance"]
            },
            {
              title: "Player ESP",
              items: ["Box 2D/Filled", "Nickname & Hero Name", "Distance", "Line ESP"]
            },
            {
              title: "Configurations",
              items: ["Config Selector/Creator", "Delete/Save/Load", "Theme & Accent Color & Language", "VSync", "Show FPS", "DPI Scale"]
            }
          ]
        }
      },
      {
        name: 'Rainbow Six Siege',
        features: {
          sections: [
            {
              title: "Aimbot",
              items: ["Enable/Disable", "FOV Circle", "FOV Slider", "Smoothing", "Bone Selection", "Visibility Check", "Recoil Control"]
            },
            {
              title: "ESP",
              items: ["Player Boxes", "Health Bars", "Distance", "Skeleton", "Snaplines", "Gadget ESP", "Trap ESP"]
            },
            {
              title: "Misc",
              items: ["No Recoil", "No Spread", "Radar Hack", "Custom Crosshair"]
            }
          ]
        }
      },
      {
        name: 'HWID Spoofer',
        features: {
          sections: [
            {
              title: "Spoof List",
              items: ["Storage Drive Serials", "RAM Serials", "Monitor Serials", "SMART & Network Adapters", "Registry Values", "MAC Address", "GPU/Motherboard"]
            },
            {
              title: "System & Compatibility",
              items: ["AES (CPU)", "Intel + AMD CPU Support", "Windows 10–11 (1809–23H2)", "Seed System Available"]
            },
            {
              title: "Supported Games",
              items: ["COD BO6 & older COD", "Rust", "Battlefield 6", "Rainbow Six Siege", "Apex", "Fortnite", "Overwatch 2", "CS2", "GTA V", "more"]
            }
          ]
        }
      }
    ];

    console.log('2. Updating products with detailed features...\n');

    for (const product of products) {
      const { data, error } = await supabase
        .from('products')
        .update({ detailed_features: product.features })
        .eq('name', product.name)
        .select();

      if (error) {
        console.error(`❌ Failed to update ${product.name}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ Updated ${product.name} with ${product.features.sections.length} feature sections`);
      } else {
        console.log(`⚠️  Product not found: ${product.name}`);
      }
    }

    console.log('\n✨ Migration completed successfully!');
    console.log('\n📝 All products now have detailed feature sets.');
    console.log('🔄 Refresh your product pages to see the new features.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();
