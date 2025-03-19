from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
import json
from config.crypto_config import ENCRYPTION_KEY, IV

class EncryptionService:
    def __init__(self):
        self.key = ENCRYPTION_KEY.encode('utf-8')
        self.iv = IV.encode('utf-8')

    def encrypt(self, data):
        """
        Encrypts data using AES-256-CBC
        """
        try:
            # Convert data to JSON string
            json_str = json.dumps(data)
            
            # Create cipher
            cipher = AES.new(self.key, AES.MODE_CBC, self.iv)
            
            # Pad and encrypt
            padded_data = pad(json_str.encode('utf-8'), AES.block_size)
            encrypted_data = cipher.encrypt(padded_data)
            
            # Encode to base64 for transmission
            encrypted_base64 = base64.b64encode(encrypted_data).decode('utf-8')
            
            return {
                "encrypted": True,
                "data": encrypted_base64
            }
        except Exception as e:
            print(f"Encryption error: {str(e)}")
            return {
                "encrypted": False,
                "data": data
            }

    def decrypt(self, encrypted_data):
        """
        Decrypts AES-256-CBC encrypted data
        """
        try:
            if not isinstance(encrypted_data, dict) or not encrypted_data.get("encrypted"):
                return encrypted_data
                
            # Decode from base64
            encrypted_bytes = base64.b64decode(encrypted_data["data"])
            
            # Create cipher
            cipher = AES.new(self.key, AES.MODE_CBC, self.iv)
            
            # Decrypt and unpad
            decrypted_padded = cipher.decrypt(encrypted_bytes)
            decrypted_data = unpad(decrypted_padded, AES.block_size)
            
            # Parse JSON
            return json.loads(decrypted_data.decode('utf-8'))
        except Exception as e:
            print(f"Decryption error: {str(e)}")
            return None 