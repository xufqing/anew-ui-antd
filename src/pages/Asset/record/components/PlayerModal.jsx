import { Modal } from 'antd';
import { useEffect } from 'react';
import { useScript } from '@/utils/useScript';

const PlayerModal = (props) => {
  const { modalVisible, onCancel, values } = props;
  const [loaded, error] = useScript('/asciinema-player.js');
  useEffect(() => {
    if (!loaded) return;
  }, [loaded, error]);
  const html = `<head><link rel="stylesheet" type="text/css" href="/asciinema-player.css" /></head><body><asciinema-player src="/api/v1/host/record/download?record=${
    values.cast_file_name
  }&token=${localStorage.getItem('token')}"></asciinema-player></body>`;
  return (
    <Modal
      title="播放录像"
      visible={modalVisible}
      onCancel={onCancel}
      footer={null}
      style={{ top: 20 }}
      width={'80%'}
    >
        <div dangerouslySetInnerHTML={{ __html: html }} />
    
    </Modal>
  );
};

export default PlayerModal;
