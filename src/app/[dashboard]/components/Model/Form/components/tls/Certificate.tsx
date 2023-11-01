import { Form, Input, Radio } from 'antd'

const tlsNamePath = ['stream', 'tls']
const tlsCertsNamePath = [...tlsNamePath, 'certs', 0]
const tlsUseFileNamePath = [...tlsCertsNamePath, 'useFile']

const useFileOptions = [
  { label: '路径', value: true },
  { label: '内容', value: false },
]

export default function Certificate() {
  return (
    <>
      <Form.Item label="域名" name={[...tlsNamePath, 'server']}>
        <Input />
      </Form.Item>

      <Form.Item label="alpn" name={[...tlsNamePath, 'alpn']}>
        <Input placeholder="http/1.1,h2" />
      </Form.Item>

      <Form.Item label="证书" name={tlsUseFileNamePath}>
        <Radio.Group options={useFileOptions} optionType="button" buttonStyle="solid" />
      </Form.Item>

      <Form.Item noStyle dependencies={[tlsUseFileNamePath]}>
        {form =>
          form.getFieldValue(tlsUseFileNamePath) ? (
            <>
              <Form.Item label="公钥文件路径" name={[...tlsCertsNamePath, 'certFile']}>
                <Input />
              </Form.Item>
              <Form.Item label="密钥文件路径" name={[...tlsCertsNamePath, 'keyFile']}>
                <Input />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="公钥内容" name={[...tlsCertsNamePath, 'cert']}>
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item label="密钥内容" name={[...tlsCertsNamePath, 'key']}>
                <Input.TextArea rows={2} />
              </Form.Item>
            </>
          )
        }
      </Form.Item>
    </>
  )
}
