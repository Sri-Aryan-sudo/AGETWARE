money=float(input())
string_money=str(money)

money_int=int(money)
floating_point_value=string_money[string_money.find('.'):]

coma_separated_money=""
count=0
while(count<3):
    digit=money_int%10
    coma_separated_money+=str(digit)
    money_int=money_int//10
    count+=1
coma_separated_money+=','
count=0
while(money_int):
    digit=money_int%10
    coma_separated_money+=str(digit)
    money_int=money_int//10
    count+=1
    if(count==2):
        count=0
        coma_separated_money+=','
coma_separated_money=coma_separated_money[::-1].strip(',')
coma_separated_money+=floating_point_value
print(f"The Coma Seperated Value is {coma_separated_money}")