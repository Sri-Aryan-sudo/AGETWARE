def enconding(word,shift):
    encoded_word=""
    for char in word:
        if char.isalpha():
            shift_amount = shift % 26
            if char.islower():
                base=ord('a')
            elif char.isupper():
                base=ord('A')
            encoded_word+=chr((ord(char)-base+shift_amount)%26+base)
        else:
            encoded_word+=char
      return encoded_word

def decoding(word,shift):
    decoded_word=""
    for char in word:
        if char.isalpha():
            shift_amount = shift % 26
            if char.islower():
                base=ord('a')
            elif char.isupper():
                base=ord('A')
            decoded_word+=chr((ord(char)-base-shift_amount)%26+base)
        else:
            decoded_word+=char
    return decoded_word