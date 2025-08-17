import React, { useMemo, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Platform } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Data shape aligned to previous TreeMapItem
interface TreeMapItem { name: string; value: number; change?: string; meta?: any }

const data: TreeMapItem[] = [
  { name: 'Figma', value: 42, change: '+8.2%', meta: { monthly: 30, category: 'Design', owner: 'Design Team', seats: 25 } },
  { name: 'Sketch', value: 28, change: '-4.5%', meta: { monthly: 20, category: 'Design', seats: 12 } },
  { name: 'Notion', value: 35, change: '+12.1%', meta: { monthly: 18, category: 'Knowledge', seats: 40 } },
  { name: 'Slack', value: 55, change: '+3.4%', meta: { monthly: 240, category: 'Collaboration', seats: 120 } },
  { name: 'Linear', value: 22, change: '+6.7%', meta: { monthly: 80, category: 'PM', seats: 35 } },
  { name: 'Jira', value: 30, change: '-2.1%', meta: { monthly: 210, category: 'PM', seats: 150 } },
  { name: 'GitHub', value: 50, change: '+1.5%', meta: { monthly: 400, category: 'Dev', seats: 60 } },
  { name: 'Vercel', value: 18, change: '+9.9%', meta: { monthly: 65, category: 'Infra', seats: 10 } },
  { name: 'Sentry', value: 16, change: '+5.0%', meta: { monthly: 90, category: 'Monitoring', seats: 10 } },
  { name: 'Datadog', value: 14, change: '-3.6%', meta: { monthly: 320, category: 'Monitoring', seats: 8 } },
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const injectedHTML = (seriesData: TreeMapItem[]) => `<!DOCTYPE html><html><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width,initial-scale=1'/>
  <style>
    html,body,#root{margin:0;padding:0;background:#07080a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;height:100%;}
    #chart{width:100%;height:100%;}
    .tooltip{position:absolute;pointer-events:none;background:#111827;color:#f1f5f9;padding:8px 10px;border-radius:8px;font-size:12px;line-height:1.3;box-shadow:0 4px 14px rgba(0,0,0,0.4);}
  </style>
  </head><body><div id='chart'></div>
  <script src='https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js'></script>
  <script>
    const raw = ${JSON.stringify(seriesData)};
    const chart = echarts.init(document.getElementById('chart'), null, {renderer:'canvas'});
    const option = {
      backgroundColor: '#07080a',
      color: ['#000000'],
    tooltip: { trigger: 'item', formatter: function(p) {
      var d=p.data; return '<b>' + d.name + '</b><br/>Value: ' + d.value + '<br/>Change: ' + (d.change||'-') + '<br/>Monthly: $' + ((d.meta && d.meta.monthly) || '-') ; } },
      series: [{
        type: 'treemap',
        roam: false,
        nodeClick:'link',
        breadcrumb:{show:false},
        label: { show:true, formatter: (p)=> p.data.name, color:'#f8fafc', fontSize:12, overflow:'truncate' },
        upperLabel:{show:false},
        itemStyle:{ borderColor:'#1e293b', borderWidth:1, gapWidth:2, color:'#000000' },
        levels:[{ itemStyle:{ gapWidth:2, borderColor:'#1e293b', color:'#000000'} }],
        data: raw
      }]
    };
    chart.setOption(option);
    chart.on('click', function(params){
       if(params && params.data){
         window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type:'select', payload: params.data }));
       }
    });
    window.addEventListener('resize', ()=>chart.resize());
  </script></body></html>`;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const sorted = useMemo(()=> [...data].sort((a,b)=> b.value - a.value), []);
  const html = useMemo(()=> injectedHTML(sorted), [sorted]);
  const webRef = useRef<WebView>(null);

  const onMessage = (e: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if(msg.type === 'select') {
        navigation.navigate('AppDetail', { app: msg.payload });
      }
    } catch(err) {
      // swallow
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}> 
        <Text style={styles.title}>Subscriptions Treemap</Text>
        <Text style={styles.subtitle}>Tap a block to view details</Text>
      </View>
      <View style={styles.chartWrapper}>
        <WebView
          ref={webRef}
          originWhitelist={["*"]}
          source={{ html }}
          onMessage={onMessage}
          style={styles.webview}
          androidLayerType={Platform.OS === 'android' ? 'hardware' : undefined}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#07080a'},
  header:{ paddingTop:40, paddingHorizontal:20, paddingBottom:16 },
  title:{ fontSize:26, fontWeight:'700', color:'#f8fafc', textAlign:'center', marginBottom:4 },
  subtitle:{ fontSize:14, color:'#64748b', textAlign:'center' },
  chartWrapper:{ flex:1, paddingHorizontal:12, paddingBottom:20 },
  webview:{ flex:1, backgroundColor:'transparent' }
});

export default HomeScreen;
