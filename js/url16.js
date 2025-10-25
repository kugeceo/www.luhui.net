function url16(str)
{
    var i,c,ret="",strSpecial="!\"#$%&()*+,/:;<=>?@[\]^`{|}~%";
    
    for(i=0;i<str.length;i++)
    {
        if(str.charCodeAt(i)>=0x4e00)
        {
            c = qswhU2GB[str.charCodeAt(i)-0x4e00];
            ret += "%" + c.slice(0,2) + "%" + c.slice(-2);
        }
        else
        {
            c=str.charAt(i);

            if(c == " ")
            {
                ret += "+";
            }
            else if(strSpecial.indexOf(c) != -1)
            {
                ret+="%"+str.charCodeAt(i).toString(16);
            }
            else
            ret+=c;
        }
    }
    
    return ret;
}