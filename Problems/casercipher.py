def encoding(word,shift):
    encoded_word=""
    for char in word:
        shift_amount=shift%26
        if char.isalpha():
            base=0
            if char.isupper():
                base=ord('A')
            else:
                base=ord('a')
            encoded_word+=chr((ord(char)-base+shift_amount)%26+base)
        else:
            encoded_word+=char
    return encoded_word
def decoding(word,shift):
    decoded_word=""
    for char in word:
        shift_amount=shift%26
        if char.isalpha():
            base=0
            if char.isupper():
                base=ord('A')
            else:
                base=ord('a')
            decoded_word+=chr((ord(char)-base-shift_amount)%26+base)
        else:
            decoded_word+=char
    return decoded_word
word='bszbo'
print(decoding(word,1))