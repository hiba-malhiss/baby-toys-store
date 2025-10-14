#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dirsToWipe = ['app', 'components', 'hooks', 'constants'];
const scriptsDir = path.join(root, 'scripts');

const indexContent = `import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Hello</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '600' },
});
`;

const layoutContent = `import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}
`;

async function main() {
  try {
    // Wipe selected directories
    for (const dir of dirsToWipe) {
      const p = path.join(root, dir);
      if (fs.existsSync(p)) {
        await fs.promises.rm(p, { recursive: true, force: true });
        console.log(`❌ /${dir} deleted.`);
      }
    }

    // Remove everything inside scripts/ except this file
    if (fs.existsSync(scriptsDir)) {
      const files = await fs.promises.readdir(scriptsDir);
      for (const f of files) {
        if (f !== 'reset-project.js') {
          await fs.promises.rm(path.join(scriptsDir, f), { recursive: true, force: true });
        }
      }
      console.log('🧹 /scripts cleaned (kept reset-project.js).');
    }

    // Recreate app with hello screen and minimal layout
    const appDir = path.join(root, 'app');
    await fs.promises.mkdir(appDir, { recursive: true });
    await fs.promises.writeFile(path.join(appDir, 'index.tsx'), indexContent);
    await fs.promises.writeFile(path.join(appDir, '_layout.tsx'), layoutContent);
    console.log('📄 app/index.tsx and app/_layout.tsx created.');

    console.log('\n✅ Clean reset complete. Run `npx expo start` to launch the app.');
  } catch (e) {
    console.error('❌ Error during clean reset:', e.message);
    process.exit(1);
  }
}

main();
