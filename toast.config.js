
import { BaseToast } from 'react-native-toast-message';

const base = {
  style: { borderRadius: 2, marginHorizontal: 14 },
  contentContainerStyle: { paddingHorizontal: 14 },
  text1Style: { fontSize: 16, fontWeight: '600', color: '#1f1f1f' }, // slate-900
};

export const toastConfig = {

  success: (props) => (
    <BaseToast
      {...props}
      {...base}
      style={[base.style, { borderLeftColor: '#0047BA', backgroundColor: '#E6ECF7' }]}
    />
  ),


  warning: (props) => (
    <BaseToast
      {...props}
      {...base}
      style={[base.style, { borderLeftColor: '#FFDC00', backgroundColor: '#FFFAE8' }]}
    />
  ),


  danger: (props) => (
    <BaseToast
      {...props}
      {...base}
      style={[base.style, { borderLeftColor: '#C10230', backgroundColor: '#F6E7EA' }]}

    />
  ),
};
